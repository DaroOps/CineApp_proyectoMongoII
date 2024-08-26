<script setup>
    import IconPlay from '@icons/actions/IconPlay.vue';
</script>

<template>
    <div class="trailer-button">
        <button class="button">
            <div class="container">
                <span class="icon">
                    <IconPlay/>
                </span>
                <div class="text">
                    Watch Trailer
                </div>
            </div>
        </button>
    </div>
</template>

<style scoped>
.trailer-button {   
    overflow: hidden;
    padding: 0 ;
    margin: 0;
    border: 0;
    
    & .button {
        color: var(--text-color);
       
        padding: 5px 8px 5px 4px;
        margin: 0;
        border: 0;
        
        & .container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 0;

            .icon{
               height: 11px;
               width: 12px;
               display: flex;
               justify-content: right;
               align-items: center;
            }
            
            .text {
                font-family: var(--font-poppins);
                height: 100%;
                vertical-align: top;
                text-align: left;
                text-wrap: nowrap;
                font-size: 8px;
                font-weight: 600;            
           }
        }

    }


}
</style>