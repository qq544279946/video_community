// 导航的静态数据
export default {
    // 主导航的数据
    navItems: [{
            name: "首页",
            index: 0,
        },
        {
            name: "舞蹈",
            index: 1,
        },
        {
            name: "动画",
            index: 2,
        },
        // {
        //     name: "音乐",
        //     index: 3,
        // },
        // {
        //     name: "游戏",
        //     index: 4,
        // },
        // {
        //     name: "知识",
        //     index: 5,
        // },

    ],
    // 次导航的数据
    navSubItems: [
        [{
                name: "推荐",
                index: 0,
            },
            {
                name: "MAD",
                index: 1,
            },
            {
                name: "MMD",
                index: 2,
            },
        ],
        [

            {
                name: "推荐",
                index: 0,
            },
            {
                name: "连载中",
                index: 1,
            },
            {
                name: "完结",
                index: 2,
            },

        ]
    ],

    // 搜索主导航
    searchNavItems: [
        {
            name: '综合',
            index: 0
        },
        {
            name: 'UP主',
            index: 1
        }
    ],

    // 视频页面的nav
    videoNav: [
        {
            name: '评论',
            index: 0
        }
    ]
}