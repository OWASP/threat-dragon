import { defineStore } from 'pinia';

export const useCellStore = defineStore('cellStore', {
  state: () => ({
    ref: null,
    threats: []
  }),
  actions: {
    selected(ref) {
      this.ref = ref;
      if (this.ref && this.ref.data && this.ref.data.threats) {
        this.ref.data.threats.forEach((threat, idx) => this.threats[idx] = threat);
      }
    },
    dataUpdated(data) {
      if (!this.ref || !this.ref.setData) {
        return;
      }

      this.ref.setData(data);

      if (data.threats) {
        this.threats.splice(0);
        data.threats.forEach((threat, idx) => this.threats[idx] = threat);
      }
    }
  }
});
