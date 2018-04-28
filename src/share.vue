
<template>
  <div>
    <section class="nav-statement">
        <div class="logo-1">
            <a href="http://www.jcloud.com/">
                <img src="./images/logo-1.png" alt="京东云">
            </a>
        </div>
        <div class="nav-right">
            <a href="https://uc.jcloud.com/user/preView" class="blueLink mr10">{{name}}</a>
            <a href="http://console.jcloud.com/" class="nav-fore">控制台</a>
        </div>
    </section>
    <router-view id="content"></router-view>
  </div>
</template>

<script>
import './style/control0803.css'
import api from './api'
export default {
    name: 'app',

    data(){
        return{
            name : ''
        }
    },

    mounted(){
        api.getUserName().then(
            res =>{
                if(res.code == "OK" && res.success){
                    this.name = res.body.username;
                }
            },
            error => {}
        )
    }
}
</script>
