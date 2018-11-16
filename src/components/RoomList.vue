<template>
    <div style="margin:10px">
        <Error v-if="error_status" v-bind:error="error_msg"/>
        <div class="header">
                <h2>Room List</h2>
                  <div class="row">
                    <div class="form-row col-6">
                        <input v-model="roomName" class="form-control form-control-sm col-8" type="text" placeholder="Room Name">
                        <button @click.prevent="createRoom()" class="btn btn-sm btn-success col-4">Create Room</button>
                    </div>
                    <div class="col-6" style="display:flex; justify-content:flex-end">
                      <button @click="chat()" type="button" class="btn btn-sm btn-danger">Chat</button>
                    </div>
                  </div>
                <div class="separator"> </div>
        </div>
        <div class="row soccerbg">
              <div class="col-3" v-for="(room, index) in roomList" :key="index" style="background-color: #dfffa9">
                  <div class="roomName">
                      {{room.name}}
                  </div>
                  <div class="roomMaster">
                      Room Master: {{room.player1.name}}
                  </div>
                  <br>
                  <div class="roomInfo row">
                      <div class="col" v-if="!room.player2 || !room.player2.name">
                        <img src="../assets/player.svg" alt="" style="width:25px"> 1
                      </div>
                      <div class="col" v-else>
                          <img src="../assets/player.svg" alt="" style="width:25px"> 2
                      </div>
                  </div>
                  <br>
                  <div class="roomJoin">
                      <button v-if="!room.player2 || !room.player2.name" @click.prevent="joinRoom(room.roomId)" class="btn btn-sm btn-success">Join Room</button>
                      <button disabled v-else class="btn btn-sm btn-danger">Room Full</button>
                  </div>                
              </div>          
        </div>
        <Chat id="chat"> </Chat>
    </div>
</template>

<script>
import Chat from "@/components/Chat.vue";
import Error from "@/components/Error.vue";
import db from "../assets/config.js";
import { functions } from "firebase";

export default {
  components: {
    Error,
    Chat
  },
  props: ["playerName"],
  data() {
    return {
      roomList: [],
      roomName: "",
      error_status: false,
      error_msg: ""
    };
  },
  methods: {
    chat: function() {
      document.getElementById('chat').scrollIntoView();
    },
    createRoom: function() {
      if (!this.roomName) {
          this.error_msg = "Room Name cannot be Empty"
          this.error_status = true
      } else {
        db.ref("rooms")
          .push({
            name: this.roomName,
            player1: {
              name: this.playerName,
              status: false
            },
            player2: {
              name: null,
              status: false
            }
          })
          .then(snapshot => {
            localStorage.setItem('roomId', snapshot.key)
            this.error_status = false
            localStorage.setItem('playerId', 'player1')
            this.$router.push("room");
          })
          .catch(err => {
            console.log(err);
            this.error_msg = err.response
            this.error_status = true
          });
      }
    },
    joinRoom: function(id) {
      db.ref(`rooms/${id}/player2/name`).set(this.playerName, snapshot => {
        this.error_status = false
        localStorage.setItem('roomId', id)
        localStorage.setItem('playerId', 'player2')
        this.$router.push("room");
      });
    }
  },
  mounted: function() {
    db.ref("rooms").on("value", snapshot => {
      let data = Object.entries(snapshot.val());
      let rooms = [];
      data.forEach(element => {
        let obj = {
          roomId: element[0],
          name: element[1].name || 'Default',
          player1: element[1].player1,
          player2: element[1].player2
        };
        rooms.push(obj);
      });
      this.roomList = rooms;
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.col-3 {
  border: 1px solid lightgray;
  margin: 10px;
  padding: 10px;
}
.header {
  text-align: left;
}
.roomMaster,
.roomInfo {
  color: slategray;
}
.separator {
  border: 1px solid lightgreen;
  margin: 10px;
}
.row {
  justify-content: space-between;
}
.soccerbg {
  background-image: url("../assets/field.png");

}
</style>
