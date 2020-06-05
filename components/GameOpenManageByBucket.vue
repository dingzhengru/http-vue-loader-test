<template>
<div id="GameOpenManageByBucket" class="game-open-manage">
  
  <!-- <p>{{ selectedBucketGames }}</p> -->
  <!-- <p>{{ selectedParentBucketGames }}</p> -->

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
            v-model="bucketIsOpenAll[selectedBucket.name][type]" 
            @change="changeIsOpenAll(gameTypeObject, bucketIsOpenAll[selectedBucket.name][type])"
          >
          {{ type }}
        </h3>
        <div class="game-item-block item-block">
          <div class="game-item item" v-for="game in gameTypeObject.children" :key="game.name">
            <input type="checkbox" v-model="game.isOpen" :disabled="bucketIsOpenAll[selectedBucket.name][type]"> 
            {{ game.name }}
          </div>
        </div>
      </div>

      <!-- 選取父分桶時 -->
      <div class="games right-block-inner text-left" v-for="(gameTypeObject, type) in selectedParentBucketGames" :key="type">
        <h3 class="sub-title">
          <input 
            type="checkbox" 
            v-model="bucketParentIsOpenAll[selectedParentBucket.name][type]" 
            @change="changeIsOpenAll(gameTypeObject, bucketParentIsOpenAll[selectedParentBucket.name][type])"
          > 
          {{ type }}
        </h3>
        <div class="game-item-block item-block">
          <div class="game-item item" v-for="(game, index) in gameTypeObject.children" :key="index">
            <input type="checkbox" 
              v-model="bucketParentIsOpenGame[selectedParentBucket.name][game]" 
              :disabled="bucketParentIsOpenAll[selectedParentBucket.name][type]"
            > 
            <!-- {{ `${ game.name } (${ game.bucket })` }} -->
            {{ game }}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- <div class="json-data">
    <div class="one-quarter">
      <h3>分桶列表，單純列出分桶名</h3>
      <vue-json-pretty :data="buckets" />
    </div>
    <div class="one-quarter">
      <h3>詳細的分桶列表，將分桶內包含的遊戲也一併列出</h3>
      <vue-json-pretty :data="relationByBucket" />
    </div>
    <div class="one-quarter">
      <h3>selectedBucketGames</h3>
      <vue-json-pretty :data="selectedBucketGames" />
    </div>
    <div class="one-quarter">
      <h3>selectedParentBucketGames</h3>
      <vue-json-pretty :data="selectedParentBucketGames" />
    </div>
  </div> -->
</div>
</template>

<script>

import VueJsonPretty  from 'vue-json-pretty'

import buckets from '@/api/buckets' // 分桶列表，單純列出分桶名
import relationByBucket from '@/api/relationByBucket.json' // 詳細的分桶列表，將分桶內包含的遊戲也一併列出
import bucketIsOpenAll from '@/api/bucketIsOpenAll' // 回傳子分桶是否全開放的資料
import bucketParentIsOpenAll from '@/api/bucketParentIsOpenAll' // 回傳父分桶是否全開放的資料
import bucketParentIsOpenGame from '@/api/bucketParentIsOpenGame' // 回傳父分桶是否全開放某遊戲

export default {
  name: 'GameOpenManageByBucket',
  components: {
    VueJsonPretty
  },
  data() {
    return {
      buckets: [],
      relationByBucket: [],
      bucketIsOpenAll: {},
      bucketParentIsOpenAll: {},
      selectedBucket: {},
      selectedBucketGames: {},
      selectedParentBucket: {},
      selectedParentBucketGames: {},
      bucketParentIsOpenGame: {}
    }
  },
  mounted() {
    this.buckets = buckets
    this.relationByBucket = relationByBucket
    this.bucketIsOpenAll = bucketIsOpenAll
    this.bucketParentIsOpenAll = bucketParentIsOpenAll
    this.bucketParentIsOpenGame = bucketParentIsOpenGame
  },
  methods: {
    changeIsOpenAll(gameTypeObject, isOpenAll) {
      if(isOpenAll) {
        // gameTypeObject.children.forEach(item => item.isOpen = true)
        gameTypeObject.children.forEach(item => {
          this.bucketParentIsOpenGame[this.selectedParentBucket.name][item] = true
        })
      }
    },
    convertSelectedBucketGames() {

      this.selectedParentBucket = {}
      this.selectedParentBucketGames = {}

      const selectedBucket = JSON.parse(JSON.stringify(this.selectedBucket))
      let item = selectedBucket.game || {}

      this.selectedBucketGames = item

      return item
    },
    convertSelectedParentBucketGames() {

      this.selectedBucket = {}
      this.selectedBucketGames = {}

      const selectedParentBucket = JSON.parse(JSON.stringify(this.selectedParentBucket))
      let item = {}
      let isOpenAll = false

      

      for(let bucket of selectedParentBucket.children) {

        let bucketGameList = []

        for(let type in bucket.game) {
          if(item[type] == undefined) {
            item[type] = {}
            item[type].children = []
          }

          for(let game of bucket.game[type].children) {
            if(!item[type].children.includes(game.name)) {
              item[type].children.push(game.name)
            }
          }

          // for(let game of bucket.game[type].children) {
          //   game.bucket = bucket.name
          //   item[type].children.push(game)
          // }
        }
      }



      this.selectedParentBucketGames = item
      return item
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
