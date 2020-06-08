<template>
<div id="GameOpenManageByBucket" class="game-open-manage">

  <div class="bucket-wrapper wrapper">
    <div class="buckets left-block block text-center">
      <h2 class="bucket-title title">{{ selectedBucket.name || selectedParentBucket.name || '分桶' }}</h2>
      <div
        class="bucket-inner left-block-inner text-left" 
        v-for="bucket in relationByBucket" 
        :key="bucket.name"
      >
        <h3 class="bucket-parent-title sub-title">
          <input type="radio" name="bucket" v-model="selectedParentBucket" :value="bucket" @change="convertSelectedParentBucketGames()">
          {{ bucket.name }}
        </h3>
        <div class="bucket-item-block item-block">
          <div 
            class="bucket-item item"
            v-for="children in bucket.children" 
            :key="children.name"
          >
            <input type="radio" name="bucket" v-model="selectedBucket" :value="children" @change="convertSelectedBucketGames()"> 
            {{ children.name }}
          </div>
        </div>
      </div>
    </div>

    <div class="divide text-center">
      <slot name="change-button">
        <button>轉換</button>
      </slot>
    </div>

    <div class="game-wrapper right-block block text-center">
      <h2 class="game-title title">遊戲</h2>
      
      <!-- 選取子分桶時 -->
      <div class="games right-block-inner text-left" v-for="(gameTypeObject, type) in selectedBucketGames" :key="type">
        <h3 class="sub-title">
          <input 
            type="checkbox" 
            v-model="bucketIsOpenAll[selectedBucket.name][gameTypeObject.name]" 
            @change="changeBucketIsOpenAll(gameTypeObject, bucketIsOpenAll[selectedBucket.name][gameTypeObject.name])"
          >
          {{ gameTypeObject.name }}
        </h3>
        <div class="game-item-block item-block">
          <div class="game-item item" v-for="game in gameTypeObject.children" :key="game.name">
            <input type="checkbox" v-model="game.isOpen" :disabled="bucketIsOpenAll[selectedBucket.name][type]"> 
            {{ game.name }}
          </div>
        </div>
      </div>

      <!-- 選取父分桶時 -->
      <div class="games right-block-inner text-left" v-for="gameTypeObject in selectedParentBucketGames" :key="gameTypeObject.name">
        <h3 class="sub-title">
          {{ gameTypeObject.name }}
        </h3>
        <div class="game-item-block item-block">
          <div class="game-item item" v-for="(game, index) in gameTypeObject.children" :key="index">
            {{ game }}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>

module.exports = {
  name: 'GameOpenManageByBucket',
  components: {},
  data() {
    return {
      buckets: [],
      relationByBucket: [],
      bucketIsOpenAll: {},
      selectedBucket: {},
      selectedBucketGames: {},
      selectedParentBucket: {},
      selectedParentBucketGames: {}
    }
  },
  async mounted() {
    const apiUrl = 'http://localhost:55555'

    this.buckets = await $.getJSON(apiUrl + '/api/buckets.json')
    this.relationByBucket = await $.getJSON(apiUrl + '/api/relationByBucket.json')
    this.bucketIsOpenAll = await $.getJSON(apiUrl + '/api/bucketIsOpenAll.json')

    this.selectedBucket = this.relationByBucket[0].children[0]
    this.convertSelectedBucketGames()
  },
  methods: {
    changeBucketIsOpenAll(gameTypeObject, isOpenAll) {
      if(isOpenAll) {
        gameTypeObject.children.forEach(item => item.isOpen = true)
      } else {
        gameTypeObject.children.forEach(item => item.isOpen = false)
      }
    },
    convertSelectedBucketGames() {
      this.selectedParentBucket = {}
      this.selectedParentBucketGames = {}

      const selectedBucket = JSON.parse(JSON.stringify(this.selectedBucket))
      let items = selectedBucket.games || []

      this.selectedBucketGames = items
      return items
    },
    convertSelectedParentBucketGames() {
      this.selectedBucket = {}
      this.selectedBucketGames = {}

      const selectedParentBucket = JSON.parse(JSON.stringify(this.selectedParentBucket))
      let items = []

      for(let bucket of selectedParentBucket.children) {
        for(let gameTypeObject of bucket.games) {

          // 創建初始的 gameType 的 object
          if(!items.map(item => item.name).includes(gameTypeObject.name)) {
            items.push({ name: gameTypeObject.name, children: [] })
          }

          // 把 game 推進對應 gameType
          for(let game of gameTypeObject.children) {
            items.find(item => item.name == gameTypeObject.name).children.push(game.name)
          }
        }
      }

      for(let item of items) { // 清除重複項目
        item.children = [...new Set(item.children)]
      }

      this.selectedParentBucketGames = items
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
