<template>
    <div id="mainContainer">
        <div id="contentContainer" class="container-fluid" >
            <div class="row">
                <div class="col-12" id="gameDisini">
                    
                    <div :class="ballClass">
                        <img style="z-index: 10; possition: absolute;" src="ball.png" alt=""> 
                    </div>
                    <div :class="keeperClass">
                        <img style="z-index: 8; possition: absolute;" src="goalkeeper.png" alt=""> 
                    </div>
                    
                    <!-- <div class="ballInit"> 
                        <img src="ball.png" alt=""> 
                    </div> -->

                    <div id="sta">
                        <br>
                        <ul class="list-group">
                            <li class="list-group-item bg-success">{{player1.playerId}} : {{player1.name}}</li>
                        </ul>
                        <br>
                        <ul class="list-group">
                            <li class="list-group-item bg-warning">{{player2.playerId}} : {{player2.name}}</li>
                        </ul>
                    </div>

                    <div id="cd">
                        {{turnCountdown}}
                    </div>

                    <div id="inputKey">
                        {{inputKeyUp}}
                        <br>
                        {{statusAs}}
                    </div>

                    <div id="rlt" class="p-2"> 
                        
                        <span class="p-2" v-for="(matchWinner, i) in eachMatchResultWinner" :key="i" >
                            <span v-if=" matchWinner == playerId" class="btn btn-info pull-right"> WIN </span>
                            <span v-if=" matchWinner != playerId" class="btn btn-danger pull-right"> LOSE </span>
                            <!-- <span class="btn btn-warning pull-right"> {{ matchWinner == playerId ? 'Lose' : 'Win' }}</span> -->
                        </span>
                    </div>

                </div>
            </div>
        </div>

        

    </div>
</template>

<script>
import db from "../assets/config";

export default {
    data () {
        return {

            ballClass : 'ballInit',
            keeperClass : 'keeperInit',
        
            player1 : {
                playerId : 'player1',
                name : '',
                moveValues : [],
            },
            player2 :{
                playerId : 'player2',
                name : '',
                moveValues : [],
            },
            

            finalInputKey : '',
            inputKeyUp : 'Out',

            turnIndex : 0,
            turnCountdown : 0,

            roomId : localStorage.getItem('roomId'),
            playerId : localStorage.getItem('playerId'),

            eachMatchResult : [],

            eachMatchResultWinner : [],

            
        }
    },
    created() {
        this.initGame()
    },
    computed : {
        // winner() {
        //     if(this.eachMatchResult[this.turnIndex] ) {
        //         return this.eachMatchResult[this.turnIndex]
        //     }
        // }
        statusAs() {
            if(this.playerId == 'player1') {
                return 'keeper'
            } else {
                return 'shooter'
            }
        }  
    },
    mounted() {
        window.addEventListener('keydown', (e) => {
            let keyPressCode = e.keyCode
            switch (keyPressCode) {
                case 37: this.inputKeyUp = 'left'; break;
                case 38: this.inputKeyUp = 'Up'; break;
                case 39: this.inputKeyUp = 'Right'; break;
                case 40: this.inputKeyUp = 'Down'; break;
                case 32: this.reloadCountDown() ; break;
                case 13: this.countItDown() ; break;

            }
        });

        db.ref(`rooms/` + this.roomId).on('value', snapshot => {
            this.player1.moveValues = snapshot.val().player1.moveValues
            this.player2.moveValues = snapshot.val().player2.moveValues
            this.turnIndex = snapshot.val().turnIndex
            this.turnCountdown = snapshot.val().turnCountdown
            this.eachMatchResult = snapshot.val().eachMatchResult
            this.eachMatchResultWinner = snapshot.val().eachMatchResultWinner
        })

        
        let machresultref = db.ref(`rooms/${this.roomId}/eachMatchResult`)
        machresultref.on('child_changed', (data) => {
            let player1Move = data.val().player1
            let player2Move = data.val().player2
            let match = this.turnIndex -1


            if(match %2 != 0) {
                if(player1Move) {
                    this.ballClass = String(player1Move).toLowerCase() + ' absolut'
                    this.keeperClass = String(player2Move).toLowerCase()
                }
                if(player1Move != player2Move) {
                    db.ref(`rooms/${this.roomId}/eachMatchResultWinner/${match}`).set(this.player1.playerId)
                } else {
                    db.ref(`rooms/${this.roomId}/eachMatchResultWinner/${match}`).set(this.player2.playerId)
                }
            } else {
                if(player1Move) {
                    this.ballClass = String(player2Move).toLowerCase() + ' absolut'
                    this.keeperClass = String(player1Move).toLowerCase()
                }
                if(player1Move != player2Move) {
                    db.ref(`rooms/${this.roomId}/eachMatchResultWinner/${match}`).set(this.player2.playerId)
                } else {
                    db.ref(`rooms/${this.roomId}/eachMatchResultWinner/${match}`).set(this.player1.playerId)
                }
            }         

        });

    },
    methods: {

        calculateEachMatch() {
            // db.ref(`rooms/` + this.roomId).once('value', snapshot => {
                // if(snapshot.val().turnIndex %2 == 0 ) {
                    // console.log(snapshot.val().player1.moveValues);
                    // console.log(snapshot.val().player1.moveValues[snapshot.val().turnIndex]);
                    // console.log(snapshot.val().player2.moveValues[snapshot.val().turnIndex]);
                // }
            // })
        },

        initGame() {
            let roomId = this.roomId

            db.ref(`rooms/${roomId}`).once('value', snapshot => {
                this.player1.name = snapshot.val().player1.name
                this.player2.name = snapshot.val().player2.name
                this.initGameEngine()
            })
        },

        initGameEngine() {
            let playerId = this.playerId
            let roomId = this.roomId

            // db.ref(`rooms/` + roomId + `/${playerId}`).once('value', () => {
            db.ref(`rooms/` + roomId + `/turnIndex`).set(0)
            db.ref(`rooms/` + roomId + `/turnCountdown`).set(5)
            db.ref(`rooms/` + roomId + `/eachMatchResult`).set({})
            db.ref(`rooms/` + roomId + `/${playerId}/moveValues`).set([0,0,0,0,0,0,0])
            db.ref(`rooms/` + roomId + `/eachMatchResultWinner`).set([])
            // })

        },

        

        excecuteInputKey () {

            this.finalInputKey = this.inputKeyUp
            db.ref(`rooms/` + this.roomId + `/${this.playerId}/moveValues/${this.turnIndex}`).set(this.inputKeyUp)
            let machresultref = db.ref(`rooms/${this.roomId}/eachMatchResult/${this.turnIndex}/${this.playerId}`)
            machresultref.set(this.inputKeyUp)

  
           

            let turnIndexAddOne = this.turnIndex + 1
            db.ref(`rooms/` + this.roomId + `/turnIndex`).set(turnIndexAddOne)
            db.ref(`rooms/` + this.roomId + `/turnCountdown`).set(5)
            this.inputKeyUp = 'Out'
            this.calculateEachMatch()

 
        },

        reloadCountDown () {
            db.ref(`rooms/` + this.roomId + `/turnIndex`).set(0)
        },

        countItDown() {

            let interval = setInterval(() => {
                if (this.turnCountdown > 0)  {
                    let turnCountdownMinusOne = this.turnCountdown -1
                    db.ref(`rooms/` + this.roomId + `/turnCountdown`).set(turnCountdownMinusOne)
                } 
            }, 1000);

            db.ref(`rooms/` + this.roomId + '/turnIndex').on('value', snapshot => {
                if(snapshot.val() == 7) {
                    clearInterval(interval);
                }
            })

            
        }
    },
    watch: {
        turnCountdown : function(newVal) {
            if(newVal == 0 ) {
                this.excecuteInputKey()
            }
        },
        turnIndex :  function(newVal) {
           
            
            if(newVal == 8) {
                let roomId = localStorage.getItem('roomId')
                db.ref(`rooms/` + roomId + `/turnIndex`).set(0)
            } 
        },
        // eachMatchResult : function(newVal) {
        //     console.log(newVal);
        // }
   
    }
}
</script>

<style>

    #mainContainer {
        /* background-image: url('/goalpostLayout.jpg'); */
        background-color: yellowgreen;
        min-height: 600px;
        z-index: 2;
    }

    #bgWallpaper {
        position: absolute;
        right: 0px;
        z-index: 0;
    }

    #gameDisini {
        display: grid;
        height: 600px;
        width: 1000px;
        background-image: url('/goalpostLayout.jpg');
        background-repeat: no-repeat;
        background-size: 1350px 600px;
        grid-template-areas: 
            "sta rlt rlt rlt rlt rlt rlt cd"
            "sta . . . Up . . out"
            ". Left . B B . Right ."
            ". . . B B . . ."
            ". . . . Down . . ."
            ". . . . . . . ."
            ". . . . . . . inputKey"
            ". . . A A . scr scr";
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: repeat(8, 1fr);
    }
    .absolut {
        position: absolute;
        padding: 30px;
    }

    .out {
        grid-area: out;
    }

    .left {
        grid-area: Left;
    }
    .up { 
        grid-area: Up;
    }
    .right {
        grid-area: Right;
    }
    .down {
        grid-area: Down;
    }

    .keeperInit {
        grid-area: B;
    }
    .ballInit {
        grid-area: A;
    }

    #sta {
        grid-area: sta;
    }

    #scr {
        grid-area: scr;
    }

    #cd {
        grid-area: cd;
        font-size: 60px;
    }

    #inputKey {
        grid-area: inputKey;
        font-size: 60px;
    }

    #rlt {
        grid-area: rlt;
    }



</style>
