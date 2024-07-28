import { ObjectId } from 'mongodb';
import DbService from '../db/dbConnection.js';
import bcrypt from 'bcrypt';

export default class User {
    static instanceUser;
    dbService;
    constructor(client = null) {
        if (User.instanceUser) {
            return User.instanceUser;
        }
        this.client = client.getClient();
        this.dbService = new DbService(this.client);
        User.instanceUser = this;
    }

    /**
     * Creates a new user in the database.
     *
     * @param {Object} userData - The user's information.
     * @param {string} userData.name - The user's name.
     * @param {string} userData.email - The user's email.
     * @param {string} userData.password - The user's password.
     * @param {string} role - The user's role ('standard', 'VIP', or 'admin').
     *
     * @returns {Promise<string>} - A promise that resolves with a success message if the user is created,
     * or rejects with an error if there is a problem creating the user.
     *
     * @throws {Error} - If the user already exists in the database.
     */
    async createUser(userData, role) {
        const db = await this.dbService.connect();
        const session = this.client.startSession();
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const usersInfo = await db.command({ usersInfo:{ user: userData.name, db: db.databaseName }});
    
            if (usersInfo.users.length > 0) {
                throw new Error('The user already exists in the database');
            }
            
            await session.withTransaction(async () => {
                const userDoc = {
                    name: userData.name,
                    email: userData.email,
                    password: hashedPassword,
                    role:{
                        type: role,
                        assignment_date: new Date()
                    },
                    purchase_history: []
                };

                if (role === 'VIP') {
                    userDoc.vip_card = this.generateVIPCard();
                }

                console.log(userDoc);
                const result = await db.collection('users').insertOne(userDoc, { session });
                return result.insertedId;
            });
            
            await db.command({
                createUser: userData.name,
                pwd: userData.password,
                roles: [{ role: role, db: db.databaseName }]
            });

           return `Created user ${userData.name} with role ${role}`; 
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        } finally {
            await session.endSession();
            await this.dbService.close();
        }
    }
    
    /**
     * Retrieves user details from the database.
     *
     * @param {string} userId - The unique identifier of the user.
     *
     * @returns {Promise<Object|null>} - A promise that resolves with the user's details if found,
     * or rejects with an error if there is a problem retrieving the user.
     * If the user is not found, the promise resolves with null.
     *
     * @throws {Error} - If there is a problem connecting to the database or executing the query.
     */
    async getUserDetails(userId) {
        try {
            const db = await this.dbService.connect();
            const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
            return user;
        } catch (error) {
            console.error('Error getting user details:', error);
            throw error;
        }finally{
            await this.dbService.close();
        }
    }

    /**
     * Updates the role of a user in the database.
     *
     * @param {string} userId - The unique identifier of the user.
     * @param {string} newRole - The new role to assign to the user.
     *
     * @returns {Promise<boolean>} - A promise that resolves with true if the user's role is successfully updated,
     * or false if no user is found with the given userId.
     *
     * @throws {Error} - If there is a problem connecting to the database or executing the query.
     *
     * @example
     * const isUpdated = await user.updateUserRole('123', 'VIP');
     * console.log(isUpdated); // true
     */
    async updateUserRole(userId, newRole) {
        try {
            const db = await this.dbService.connect();
            const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

            if (!user) {
                return false;
            }

            const updateDoc = {
                $set: { 
                    "role": {
                        "type": newRole, 
                        "assignment_date": new Date()
                    } 
                }
            };

            if (newRole === 'VIP' && (!user.vip_card || user.vip_card.expiration_date < new Date())) {
                updateDoc.$set.vip_card = this.generateVIPCard();
            } else if (newRole !== 'VIP' && user.vip_card) {
                updateDoc.$unset = { vip_card: "" };
            }

            const result = await db.collection('users').updateOne(
                { _id: new ObjectId(userId) },
                updateDoc
            );

            return result.modifiedCount > 0;
        } catch (error) {
            console.error('Error updating user role:', error);
            throw error;
        } finally {
            await this.dbService.close();
        }
    }

   /**
     * Retrieves a list of users from the database based on the specified role.
     *
     * @param {string} [role=null] - The role to filter users by. If not provided, all users will be returned.
     *
     * @returns {Promise<Array>} - A promise that resolves with an array of user objects.
     * If no users are found, the promise resolves with an empty array.
     *
     * @throws {Error} - If there is a problem connecting to the database or executing the query.
     *
     * @example
     * const userList = await user.listUsers('VIP');
     * console.log(userList); // [{ _id: new ObjectId('123'), name: 'John Doe', role: 'standard', ... }, ...]
     */
    async listUsers(role = null) {
        try {
            const db = await this.dbService.connect();
            const query = role ? { "role.type": `${role}` } : {};
            const users = await db.collection('users').find(query).toArray();
            return users;
        } catch (error) {
            console.error('Error listing users:', error);
            throw error;
        }finally{
            await this.dbService.close();
        }
    }

    generateVIPCard() {
        const cardNumber = Math.random().toString(36).substr(2, 8).toUpperCase();
        const issueDate = new Date();
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);

        return {
            card_number: cardNumber,
            issue_date: issueDate,
            expiration_date: expirationDate
        };
    }
}