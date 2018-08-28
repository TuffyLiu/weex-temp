<template>
<div class="wrapper">
    <image :src="logo" class="logo"/>
    <text class="greeting">The environment is ready!</text>
    <HelloWorld/>
    <text class="message">{{config}}</text>
    <div @click="onClicked">
       <text class="message">点击跳转page2</text>
    </div>
</div>
</template>

<script>
import {
    utils
} from '@/utils';
import HelloWorld from '@/components/components1.vue';
export default {
    name: 'App',
    components: {
        HelloWorld
    },
    data() {
        return {
            config: weex.config.env,
            logo: 'https://gw.alicdn.com/tfs/TB1yopEdgoQMeJjy1XaXXcSsFXa-640-302.png'
        };
    },
    methods: {
        onClicked(e) {
            utils.jumpPage({
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
    width: 212px;
    height: 100px;
}

.greeting {
    text-align: center;
    margin-top: 35px;
    font-size: 25px;
    color: #41B883;
}

.message {
    margin: 15px;
    font-size: 16px;
    color: #727272;
}
</style>
