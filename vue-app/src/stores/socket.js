import { defineStore } from 'pinia'
import { useScreeningStore } from '@stores/screenings.js';
import { io } from 'socket.io-client'

export const useSocketStore = defineStore('socket', {
  state: () => ({
    socket: null,
    connected: false,
    currentRoom: null,
  }),
  actions: {
    initSocket() {
      if (!this.socket) {
        this.socket = io('http://localhost:3000/', {
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
        })

        this.socket.on('connect', () => {
          this.connected = true
          console.log('Connected to server')
        })

        this.socket.on('disconnect', () => {
          this.connected = false
          console.log('disconnected from server')
        })
      }
      const screeningStore = useScreeningStore();
      this.socket.on('screeningUpdated', (newMessage) => {
        screeningStore.receivedSocketEvent();
        console.log(`Screening updated: ${newMessage}`);
        
      });
    },
    joinRoom(room) {
        if (this.socket && typeof room === 'string' && room.trim() !== '') {
            this.socket.emit('joinRoom', room)
            this.currentRoom = room
        } else {
            console.error('Name of room invalid or socket not initialized')
        }
    },
    leaveRoom() {
      if (this.socket && this.currentRoom) {
        this.socket.emit('leave room', this.currentRoom)
        this.currentRoom = null
      }
    },
    
  },
})