<template>
<div class="bgRoom">
  <div class="container">
    <div class="row d-flex justify-content-center ">
      <h1 class="roomTitle">{{name}} Room</h1>
    </div>
    <div class="row ">
      <div class="col d-flex justify-content-center">
        <div class="card" style="width: 18rem;">
          <img class="card-img-top" src="https://media.giphy.com/media/l2SqhBqTu2y1Kk4GA/giphy.gif" style="max-height: 500px">
          <div class="card-body">
            <h5 class="card-title">{{player1.name}}</h5>
            <a v-if="player1.status === false" @click="readyFunct('player1')" class="btn btn-primary">Ready!</a>
            <a v-if="player1.status === true" @click="unreadyFunct('player1')" class="btn btn-primary bg-danger">Ready!</a>
          </div>
        </div>
      </div>
      <div class="col d-flex justify-content-center ">
        <h1 style="" class="sameFont">VS</h1>
      </div>
      <div class="col d-flex justify-content-center">
        <div v-if="player2.name != undefined" class="card" style="width: 18rem;">
          <img class="card-img-top" src='https://media.giphy.com/media/xUA7bbLx97G7nr9Aha/giphy.gif' style="max-height: 500px">
          <div class="card-body">
            <h5 class="card-title">{{player2.name}}</h5>
            <a v-if="player2.status === false" @click="readyFunct('player2')" class="btn btn-primary">Ready!</a>
            <a v-if="player2.status === true" @click="unreadyFunct('player2')" class="btn btn-primary bg-danger">Ready!</a>
          </div>
        </div>
      </div>
    </div>
      <div v-if="player1.status==true && player2.status == true" class="row d-flex justify-content-center">
        <div class="sub-main">
          <button @click="startGame" class="button-two">
            <span>START GAME</span>
          </button>
        </div>
      </div>

      <div style="margin-top: 40px">
  <form action="">
    <h4 class="roomTitle" style="font-size: 50px; color: white">Chatbox</h4>
    <input v-model="inputChat" type="text">
    <button class="btn bg-dark" @click="chatSubmit"> SEND </button>
    <h5 class="roomTitle" style="font-size: 20px; color: white" v-if="chat.length<5" v-for="(element,index) in chat" :key="index">{{element.name}} : {{element.val}}</h5>
    <h5 class="roomTitle" style="font-size: 20px; color: white" v-if="chat.length>=5" v-for="(element,index) in chat.slice(0,4)" :key="index">{{element.name}} : {{element.val}}</h5>
  </form>
      </div>
  </div>
      <audio id="ready" >
        <source src="../assets/ready.mp3" type="audio/mpeg">
      </audio>

      <audio id="starting">
        <source src="../assets/starting.mp3" type="audio/mpeg">
      </audio>
      
</div>
</template>


<script>
import db from "../assets/config.js";
import { mapState } from "vuex";
import { functions } from "firebase";

export default {
  data() {
    return {
      name: "",
      player1: "",
      player2: "",
      inputChat: "",
      isReady: false,
      chat: []
    };
  },
  methods: {
    chatSubmit(e) {
      e.preventDefault();
      db.ref(`rooms/${localStorage.getItem("roomId")}`).update({
        chat: { val: this.inputChat, name: localStorage.getItem("user") }
      });
    },
    startGame() {
      db.ref(`rooms/${localStorage.getItem("roomId")}`).update({
        status: "onGame"
      });
      this.$router.push("/gameboard");
    },
    readyFunct(input) {
      let ready = document.getElementById("ready");
      ready.play();
      db.ref(`rooms/${localStorage.getItem("roomId")}/${input}`).update({
        status: true
      });
    },
    unreadyFunct(input) {
      db.ref(`rooms/${localStorage.getItem("roomId")}/${input}`).update({
        status: false
      });
    }
  },
  mounted() {
    let rooms = db.ref(`rooms/${localStorage.getItem("roomId")}`);
    rooms.on("value", snapshot => {
      // console.log(snapshot.val());
      this.player1 = snapshot.val().player1;
      this.player2 = snapshot.val().player2;
      this.name = snapshot.val().name;
      if (
        snapshot.val().player1.status == true &&
        snapshot.val().player2.status == true
      ) {
        let starting = document.getElementById("starting");
        starting.play();
      }

      if (snapshot.val().status == "onGame") {
        this.$router.push("/gameboard");
      }
    });

    db
      .ref(`rooms/${localStorage.getItem("roomId")}/chat`)
      .on('value', snapshot => {
        console.log(snapshot.val())
          if (snapshot.val()) {
        this.chat.unshift(snapshot.val());
      }
      })

    db
      .ref(`rooms/${localStorage.getItem("roomId")}`)
      .once("value", snapshot => {
        if (snapshot.val().player2.name == undefined) {
          localStorage.setItem("user", snapshot.val().player1.name);
        } else {
          localStorage.setItem("user", snapshot.val().player2.name);
        }
      });
  }
};
</script>

<style scoped>
@font-face {
  font-family: "Bangers";
  font-style: normal;
  font-weight: 400;
  src: local("Bangers Regular"), local("Bangers-Regular"),
    url(https://fonts.gstatic.com/s/bangers/v10/FeVQS0BTqb0h60ACH55Q2A.woff2)
      format("woff2");
  unicode-range: U + 0000-00ff, U + 0131, U + 0152-0153, U + 02bb-02bc, U + 02c6,
    U + 02da, U + 02dc, U + 2000-206f, U + 2074, U + 20ac, U + 2122, U + 2191,
    U + 2193, U + 2212, U + 2215, U + FEFF, U + FFFD;
}
/* latin */
@font-face {
  font-family: "Luckiest Guy";
  font-style: normal;
  font-weight: 400;
  src: local("Luckiest Guy Regular"), local("LuckiestGuy-Regular"),
    url(https://fonts.gstatic.com/s/luckiestguy/v8/_gP_1RrxsjcxVyin9l9n_j2hTd52.woff2)
      format("woff2");
  unicode-range: U + 0000-00ff, U + 0131, U + 0152-0153, U + 02bb-02bc, U + 02c6,
    U + 02da, U + 02dc, U + 2000-206f, U + 2074, U + 20ac, U + 2122, U + 2191,
    U + 2193, U + 2212, U + 2215, U + FEFF, U + FFFD;
}

.roomTitle {
  font-family: "Bangers";
  font-size: 100px;
}

.sameFont {
  font-family: "Luckiest Guy";
  position: relative;
  top: 50%;
  font-size: 150px;
  color: rgb(65, 179, 40);
}

.bgRoom {
  min-height: 900px;
  background-image: url("../assets/bgRoom.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

/*Button Two*/
.button-two {
  border-radius: 4px;
  background-color: #d35400;
  border: none;
  padding: 20px;
  width: 200px;
  transition: all 0.5s;
}

.button-two span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}

.button-two span:after {
  content: "»";
  position: absolute;
  opacity: 0;
  top: 0;
  right: -20px;
  transition: 0.5s;
}

.button-two:hover span {
  padding-right: 25px;
}

.button-two:hover span:after {
  opacity: 1;
  right: 0;
}
</style>
