<template>
<div id="GameOpenManageByBucket" class="game-open-manage">

  <div class="game-wrapper wrapper">

    <div class="game left-block block text-center">
      <h2 class="game-title">{{ selectedGame.name || '遊戲' }}</h2>

      <div class="games left-block-inner text-left" v-for="gameType in relationByGame" :key="gameType.name">
        <h3 class="sub-title">
          <input type="radio" name="game" v-model="selectedGameType" :value="gameType" @change="convertSelectedGameTypeBuckets()">
          {{ gameType.name }}
        </h3>
        <div class="game-item-block item-block">
          <div class="game-item item" v-for="game in gameType.children" :key="game.name">
            <input type="radio" name="game" v-model="selectedGame" :value="game" @change="convertSelectedGameBuckets()"> 
            {{ game.name }}
          </div>
        </div>
      </div>
    </div>

    <div class="divide text-center">
      <slot name="change-button">
        <button>轉換</button>
      </slot>
    </div>

    <div class="bucket-wrapper right-block block text-center">
      <h2 class="bucket-title title">分桶</h2>

      <!-- 選取遊戲時 -->
      <div
        class="buckets right-block-inner text-left" 
        v-for="(bucket, bucketName) in selectedGameBuckets" 
        :key="bucketName"
      >
        <h3 class="sub-title">
          <input 
            type="checkbox" 
            v-model="gameIsOpenAll[selectedGame.name][bucketName]" 
            @change="changeIsOpenAll(bucket, gameIsOpenAll[selectedGame.name][bucketName])"
          >
          {{ bucketName }}
        </h3>
        <div class="bucket-item-block item-block">
          <div class="bucket-item item" v-for="bucketItem in bucket.children" :key="bucketItem.name">
            <input type="checkbox" v-model="bucketItem.isOpen" :disabled="gameIsOpenAll[selectedGame.name][bucketName]"> 
            {{ bucketItem.name }}
          </div>
        </div>
      </div>

      <!-- 選取遊戲類型時 -->
      <div
        class="buckets right-block-inner text-left" 
        v-for="(bucket, bucketName) in selectedGameTypeBuckets" 
        :key="bucketName"
      >
        <h3 class="sub-title">
          <input 
            type="checkbox" 
            v-model="gameTypeIsOpenAll[selectedGameType.name][bucketName]" 
            @change="changeIsOpenAll(bucket, gameTypeIsOpenAll[selectedGameType.name][bucketName])"
          > 
          {{ bucketName }}
        </h3>
        <div class="bucket-item-block item-block">
          <div class="bucket-item item" v-for="(bucketItem, index) in bucket.children" :key="index">
            <!-- <input type="checkbox" v-model="bucketItem.isOpen" :disabled="gameTypeIsOpenAll[selectedGameType.name][bucketName]">  -->
            <!-- {{ `${ bucketItem.name } (${ bucketItem.game })` }} -->
            <input type="checkbox" v-model="gameTypeIsOpenBucket[selectedGameType.name][bucketItem]" :disabled="gameTypeIsOpenAll[selectedGameType.name][bucketName]">
            {{ bucketItem }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- <div class="json-data">
    <div class="one-quarter">
      <h3>遊戲列表</h3>
      <vue-json-pretty :data="games" />
    </div>
    <div class="one-quarter">
      <h3>詳細的遊戲列表，有此遊戲的分桶也列出</h3>
      <vue-json-pretty :data="relationByGame" />
    </div>
    <div class="one-quarter">
      <h3>selectedGameBuckets</h3>
      <vue-json-pretty :data="selectedGameBuckets" />
    </div>
    <div class="one-quarter">
      <h3>selectedGameTypeBuckets</h3>
      <vue-json-pretty :data="selectedGameTypeBuckets" />
    </div>
  </div> -->
</div>
</template>

<script>

// import VueJsonPretty  from 'vue-json-pretty'

// import games from '@/api/games' // 遊戲列表，單純列出分桶名
// import relationByGame from '@/api/relationByGame' // 詳細的遊戲列表，有此遊戲的分桶也列出
// import gameIsOpenAll from '@/api/gameIsOpenAll' // 回傳遊戲是否全開放的資料
// import gameTypeIsOpenAll from '@/api/gameTypeIsOpenAll' // 回傳遊戲類型是否全開放的資料
// import gameTypeIsOpenBucket from '@/api/gameTypeIsOpenBucket' // 回傳遊戲類型是否全開放某遊戲

module.exports = {
  name: 'GameOpenManageByBucket',
  components: {},
  data() {
    return {
      games: [],
      relationByGame: [],
      gameIsOpenAll: {},
      gameTypeIsOpenAll: {},
      gameTypeIsOpenBucket: {},
      selectedGame: {},
      selectedGameBuckets: {},
      selectedGameType: {},
      selectedGameTypeBuckets: {}
    }
  },
  async mounted() {
    const apiUrl = 'http://localhost:55555'

    console.log(123)

    this.games = await $.getJSON(apiUrl + '/api/games.json')
    this.relationByGame = await $.getJSON(apiUrl + '/api/relationByGame.json')
    this.gameIsOpenAll = await $.getJSON(apiUrl + '/api/gameIsOpenAll.json')
    this.gameTypeIsOpenAll = await $.getJSON(apiUrl + '/api/gameTypeIsOpenAll.json')
    this.gameTypeIsOpenBucket = await $.getJSON(apiUrl + '/api/gameTypeIsOpenBucket.json')
  },
  methods: {
    changeIsOpenAll(bucket, isOpenAll) {
      if(isOpenAll) {
        // bucket.children.forEach(item => item.isOpen = true)
        bucket.children.forEach(item => {
          this.gameTypeIsOpenBucket[this.selectedGameType.name][item] = true
        })
      }
    },
    convertSelectedGameBuckets() {
      
      this.selectedGameType = {}
      this.selectedGameTypeBuckets = {}
      
      const selectedGame = JSON.parse(JSON.stringify(this.selectedGame))
      let item = selectedGame.bucket || {}

      this.selectedGameBuckets = item

      return item
    },
    convertSelectedGameTypeBuckets() {

      this.selectedGame = {}
      this.selectedGameBuckets = {}

      let item = {}
      const selectedGameType = JSON.parse(JSON.stringify(this.selectedGameType))

      for(let game of selectedGameType.children) {
        for(let bucketParent in game.bucket) {
          if(item[bucketParent] == undefined) {
            item[bucketParent] = {}
            item[bucketParent].children = []
          }

          for(let bucket of game.bucket[bucketParent].children) {
            if(!item[bucketParent].children.includes(bucket.name)) {
              item[bucketParent].children.push(bucket.name)
            }
          }

          // for(let bucket of game.bucket[bucketParent].children) {
          //   bucket.game = game.name
          //   item[bucketParent].children.push(bucket)
          // }
        }
      }

      this.selectedGameTypeBuckets = item

      return item
    }
  }
}
</script>

<style scoped>

/*
  左右區塊
*/
.divide {
  float: left;
  margin: 0 15px;
  width: 5%;
  box-sizing: border-box;
}

.game-open-manage {}

.wrapper {}

.left-block, .right-block {
  border: 1px solid #ccc;
}

.title {}

.left-block-inner, .right-block-inner {
  padding: 0 20% 15px 15px;
}

.sub-title {
  padding: 0px;
  margin: 0px 0px 5px 0px;
}

.item-block {
  border: 1px solid #ccc;
  padding: 5px 15px 5px 0px;
}

.item {
  display: inline-block;
  margin-left: 15px;
  min-width: 45%;
}

/*
  共用常用類型
*/
.half-block {
  float: left;
  padding: 0 15px;
  width: 50%;
  box-sizing: border-box;
}

.one-third {
  float: left;
  padding: 0 15px;
  width: 33%;
  box-sizing: border-box;
}

.one-quarter {
  float: left;
  padding: 0 15px;
  width: 25%;
  box-sizing: border-box;
}

.json-data {
  float: left;
  width: 100%;
}

.block {
  float: left;
  margin: 0 15px;
  width: 40%;
  box-sizing: border-box;
}

.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

</style>