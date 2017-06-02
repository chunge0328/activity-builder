export default {
    findAward(id) {
      window.awards = [
            {"index":0,"id":"6104","name":"魅族PRO6","type":"MATERIAL","icon":"http://game.res.meizu.com/gamecenter/fileserver/activity/image/295/1486956438960.png"},
            {"index":1,"id":"6105","name":"暖手宝移动电源","type":"MATERIAL","icon":"http://game.res.meizu.com/gamecenter/fileserver/activity/image/65/1495026358171bMbiV2kW_getlottery01.png"},
            {"index":2,"id":"6106","name":"100元话费","type":"TELCHARGE","icon":"http://game.res.meizu.com/gamecenter/fileserver/activity/image/295/1486956439000.png"},
            {"index":3,"id":"6107","name":"碎片","type":"PROP","icon":"http://game.res.meizu.com/gamecenter/fileserver/activity/image/295/1486956439016.png"},{"index":4,"id":"6108","name":"20元话费","type":"TELCHARGE","icon":"http://game.res.meizu.com/gamecenter/fileserver/activity/image/295/1486956439045.png"},{"index":5,"id":"6109","name":"10元话费","type":"TELCHARGE","icon":"http://game.res.meizu.com/gamecenter/fileserver/activity/image/295/1486956439062.png"}];
        let len = window.awards ? window.awards.length : 0
        for (let i = 0; i < len; i++) {
            let award = window.awards[i]
            if (award.id == id) {
                return award
            }
        }
    }
}
