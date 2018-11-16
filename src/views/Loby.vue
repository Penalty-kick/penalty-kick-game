<template>
    <div id="content" v-if="playerName">
        <div class="banner">
                <h1>
                    <span style="background-color: rgba(0,0,0,0.4)">Welcome <i>{{playerName}}</i> to
                    </span>
                </h1>
                <h1 class="animate-pop-in">
                    <span style="background-color: rgba(0,0,0,0.4)">
                        Penalty &nbsp;<img src="http://www.tektoys.com/images/soccer-ball.png" class="ball" alt="">
                        &nbsp; Kick!
                    </span>
                </h1>
        </div>
        <RoomList v-bind:playerName="playerName"> </RoomList>
    </div>
    <div class="container" v-else>
        <div id="login-row" class="row justify-content-center align-items-center">
            <div id="login-column" class="col-md-6">
                <div class="box">
                    <img src="../assets/loginpic.png" alt="Soccer Guy">
                    <form class="form" action="">
                        <div class="form-group">
                            <input v-model="playerInput" autofocus="autofocus" type="text" name="username" id="username" class="form-control" placeholder="Enter your Name">
                        </div>
                        <button @click.prevent="login()" type="submit" class="btn btn-info">Ready for Kick-Off</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import RoomList from "@/components/RoomList.vue";

export default {
  name: "lobby",
  components: {
    RoomList
  },
  data() {
    return {
      playerInput: "",
      playerName: ""
    };
  },
  methods: {
    login: function() {
      this.playerName = this.playerInput
    }
  },
};
</script>

<style scoped>
#content {
    text-align: center
}
.banner {
    background-image: url("../assets/goalpost.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    color: #F3E5AB;
}

/* Animations
https://cssanimation.rocks/animating-hero-header/ 
*/

@keyframes pop-in {
  0% {
    opacity: 0;
    transform: translateY(-4rem) scale(.8);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}

/*Soccerball Spin
http://www.tektoys.com/web-stuff/css3-animation-cool-usages.html
*/
img.ball {
  animation: rotateball 5s linear infinite;
}
@keyframes rotateball {
  100% {transform:rotateZ(360deg);}
}
</style>