<template>
<div class="wrapper">
    <image :src="logo" class="logo" @click="onclick" />
    <text class="greeting">The environment is ready!{{hash}}</text>
    <HelloWorld/>
</div>
</template>

<script>
import {
    jumpPage
} from '@/util';
import HelloWorld from '@/components/components1.vue';
export default {
    name: 'App',
    components: {
        HelloWorld
    },
    data() {
        return {
            hash: '',
            logo: 'https://gw.alicdn.com/tfs/TB1yopEdgoQMeJjy1XaXXcSsFXa-640-302.png'
        };
    },
    methods: {
        onclick(e) {
            jumpPage({
                weexPage: 'page2'
            }, {
                ddd: 33
            });
        }
    }
};
</script>

<style scoped>
.wrapper {
    justify-content: center;
    align-items: center;
}

.logo {
    width: 424px;
    height: 200px;
}

.greeting {
    text-align: center;
    margin-top: 70px;
    font-size: 50px;
    color: #41B883;
}

.message {
    margin: 30px;
    font-size: 32px;
    color: #727272;
}
</style>
