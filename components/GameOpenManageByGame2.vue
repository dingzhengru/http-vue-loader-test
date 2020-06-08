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
        v-for="bucket in selectedGameBuckets" 
        :key="bucket.name"
      >
        <h3 class="sub-title">
          <input 
            type="checkbox" 
            v-model="gameIsOpenAll[selectedGame.name][bucket.name]" 
            @change="changeGameIsOpenAll(bucket, gameIsOpenAll[selectedGame.name][bucket.name])"
          >
          {{ bucket.name }}
        </h3>
        <div class="bucket-item-block item-block">
          <div class="bucket-item item" v-for="bucketItem in bucket.children" :key="bucketItem.name">
            <input type="checkbox" v-model="bucketItem.isOpen" :disabled="gameIsOpenAll[selectedGame.name][bucket.name]"> 
            {{ bucketItem.name }}
          </div>
        </div>
      </div>

      <!-- 選取遊戲類型時 -->
      <div
        class="buckets right-block-inner text-left" 
        v-for="bucket in selectedGameTypeBuckets" 
        :key="bucket.name"
      >
        <h3 class="sub-title">
          {{ bucket.name }}
        </h3>
        <div class="bucket-item-block item-block">
          <div class="bucket-item item" v-for="(bucketItem, index) in bucket.children" :key="index">
            {{ bucketItem }}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
// import games from '@/api/games' // 遊戲列表，單純列出分桶名
// import relationByGame from '@/api/relationByGame' // 詳細的遊戲列表，有此遊戲的分桶也列出
// import gameIsOpenAll from '@/api/gameIsOpenAll' // 回傳遊戲是否全開放的資料

module.exports = {
  name: 'GameOpenManageByBucket',
  components: {},
  data() {
    return {
      games: [],
      relationByGame: [],
      gameIsOpenAll: {},
      selectedGame: {},
      selectedGameBuckets: {},
      selectedGameType: {},
      selectedGameTypeBuckets: {}
    }
  },
  async mounted() {
    const apiUrl = 'http://localhost:55555'

    this.games = await $.getJSON(apiUrl + '/api/games.json')
    this.relationByGame = await $.getJSON(apiUrl + '/api/relationByGame.json')
    this.gameIsOpenAll = await $.getJSON(apiUrl + '/api/gameIsOpenAll.json')

    this.selectedGame = this.relationByGame[0].children[0]
    this.convertSelectedGameBuckets()
  },
  methods: {
    changeGameIsOpenAll(bucket, isOpenAll) {
      if(isOpenAll) {
        bucket.children.forEach(item => item.isOpen = true)
      } else {
        bucket.children.forEach(item => item.isOpen = false)
      }
    },
    convertSelectedGameBuckets() {
      this.selectedGameType = {}
      this.selectedGameTypeBuckets = {}
      
      const selectedGame = JSON.parse(JSON.stringify(this.selectedGame))
      let items = selectedGame.buckets || []

      this.selectedGameBuckets = items
      return items
    },
    convertSelectedGameTypeBuckets() {
      this.selectedGame = {}
      this.selectedGameBuckets = {}

      let items = []
      const selectedGameType = JSON.parse(JSON.stringify(this.selectedGameType))

      for(let game of selectedGameType.children) {
        for(let bucketParent of game.buckets) {

          // 創建初始 bucketParent 的 object
          if(!items.map(item => item.name).includes(bucketParent.name)) {
            items.push({ name: bucketParent.name, children: [] })
          }

          // 把 bucket 推進對應 bucketParent
          for(let game of bucketParent.children) {
            items.find(item => item.name == bucketParent.name).children.push(game.name)
          }
        }
      }

      for(let item of items) { // 清除重複項目
        item.children = [...new Set(item.children)]
      }

      this.selectedGameTypeBuckets = items
      return items
    }
  }
}
</script>

<style scoped>
/*
  @import '@/style/GameOpenManage.scss';
*/

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
/*.half-block {
  float: left;
  padding: 0 15px;
  width: 50%;
  box-sizing: border-box;
}*/

/*.one-third {
  float: left;
  padding: 0 15px;
  width: 33%;
  box-sizing: border-box;
}*/

/*.one-quarter {
  float: left;
  padding: 0 15px;
  width: 25%;
  box-sizing: border-box;
}*/

/*.json-data {
  float: left;
  width: 100%;
}*/

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