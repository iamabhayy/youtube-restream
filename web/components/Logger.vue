<template>
  <b-card no-body header="Logger">
    <div>
        <b-table striped small hover  :items="items"></b-table>
    </div>
  </b-card>
</template>

<script>
export default {
    data() {
      return {
        items: [
          { log: 'log is not defined', type: 'debug' },
          { log: 'Success stream.', type: 'info' },
          { log: 'Error during downloading', type: 'error' },
          { log: 'Streaming started', type: 'info' }
        ]
      }
    },
    methods: {
      rowClass(item, type) {
      if (!item || type !== 'row') return
        if (item.type === 'info') return 'table-success'
      }
    }
}
</script>

<style>
th {
  display: none;
}
</style>