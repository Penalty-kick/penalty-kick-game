<template>
    <div class=row>
        <div class="col-md-3">
            <img class="ml-5 mt-1" size="200px" src="../assets/ronaldo.jpeg" alt="">
        </div>
        <div class="col-md-6">
        <button v-for="(chatItem ,index) in chat" :key="index" type="button" class="list-group-item list-group-item-action">{{chatItem.name}} say : {{chatItem.message}} @{{chatItem.date}}
        </button> <br>
        <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-sm">{{player}}</span>
            <br>
            <input v-model="text" type="text" placeholder="type here and enter" v-on:keyup.enter="sendMessage" class="input-group-text-sm" >  
        </div>
        </div>
        <button @click="clearAll" class="btn btn-danger btn-sm">Clear Chat</button> || 
        <button @click="api" class="btn btn-danger btn-sm">Premiere League Updates</button>
        <li v-for="(item, index) in leagues" :key="index">{{item.team_name}} || Overall League Position : {{item.overall_league_position}} </li>
    </div>
    <div class="col-md-3">
        <img class="ml-4" src="../assets/pogba-3.jpg" alt="">
    </div>
    
    </div>
</template>

<script>
//firebase.database()
import axios from 'axios'
import database from '../assets/config.js'
import { log } from 'util';
export default {
    data(){
        return{
            player : '',
            text : '',
            date : '',
            month : '',
            year : '',
            hour : '',
            minute : '',
            chat : '',
            leagues : []
        }
    },
    created() {
         this.player = localStorage.getItem('player')
    },
    mounted() {
        const globalChat = database.ref('globalChat')

        globalChat.on('value',(snapshot)=>{
                this.chat = snapshot.val()
                console.log(snapshot.val())
            })
          
    },
    methods : {
        getGlobalChat(){
   
        },
        sendMessage(){
            const globalChat = database.ref('globalChat')
            this.date = new Date().getDate()
            this.month = new Date().getMonth()
            this.year = new Date().getFullYear()
            this.hour = new Date().getHours()
            this.minute = new Date().getMinutes()
            globalChat.push({
                name : this.player,
                message : this.text,
                date : this.hour + ':' + this.minute + '   '+ this.date + '-' + this.month + '-' + this.year
            })
            this.text = '' 
        },
        clearAll(){
            const globalChat = database.ref('globalChat')
            globalChat.remove()
        },
        api(){
            axios.get('https://apifootball.com/api/?action=get_standings&league_id=62&APIkey=66ee0d9831e1a91571520796ac895a5d15e7ddecc2e52f833a6b502b4743a9af')
             .then(data=>{
                 this.leagues = data.data
             })
             .catch(err=>{
                 console.log(err)
             })
        }
    }
}
</script>

<style>
    
</style>
