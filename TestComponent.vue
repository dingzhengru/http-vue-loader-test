<template>
<div>
  <h3>TestComponent</h3>
  <p>{{ buckets }}</p>
</div>
</template>

<script>



module.exports = {
  data() {
    return {
      buckets: []
    }
  },
  async mounted() {
    
    const url = 'http://localhost:55555'

    // Axios
    // const bucketsData = await axios.get(url + '/api/buckets.json')
    // this.buckets = bucketsData.data

    // Jquery 兩種方式，看有沒有要用 await
    // $.getJSON(url + '/api/buckets.json', (data) => this.buckets = data)

    this.buckets = await $.getJSON(url + '/api/buckets.json')

  }
};

</script>

<style scoped>

</style>
