const app = {
    data() {
        return {
            a: 0
        }
    },
    created() {
        setInterval(() => this.a++, 1000);
    }
}

Vue.createApp(app).mount('#app');