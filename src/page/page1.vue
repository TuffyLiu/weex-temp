<template>
<div class="wrapper">
    <image :src="logo" class="logo"/>
    <text class="greeting">The environment is ready!</text>
    <HelloWorld/>
    <div @click="onClicked">
       <text>点击跳转page2</text>
    </div>
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
            logo: 'https://gw.alicdn.com/tfs/TB1yopEdgoQMeJjy1XaXXcSsFXa-640-302.png'
        };
    },
    methods: {
        onClicked(e) {
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
