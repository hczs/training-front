<template>
  <div>
    <!-- 倍速播放组件 -->
    <script charset="utf-8" type="text/javascript" src="/js/aliplayercomponents-1.0.5.min.js" />
    <el-container>
      <el-header>
        <h2 class="mt15">{{ course.title }}</h2>
      </el-header>
      <el-container>
        <!-- 侧边栏课程目录 -->
        <el-aside width="300px">
          <el-tree
            :data="chapterList"
            :props="defaultProps"
            class="filter-tree"
            default-expand-all
            style="height: 600px"
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node, data }" style="font-size: 15px" class="custom-tree-node">
              <span v-if=" data.children == null">
                <span v-if="data.accomplishFlag === 1" style="color: green">{{ node.label }}  <i class="el-icon-success"/></span>
                <span v-else>{{ node.label }}</span>
              </span>
              <span v-else>{{ node.label }}</span>
            </span>
          </el-tree>
        </el-aside>
        <!-- 课程播放 -->
        <el-main>
          <h3 v-if="videoId !== ''">正在播放：{{ videoName }}</h3>
          <!-- 定义播放器dom -->
          <div id="J_prismPlayer" class="prism-player mt10" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import course from '@/api/learning/course'
import video from '@/api/learning/video'
import staffVideo from '@/api/learning/staffVideo'
export default {

  asyncData({ params, error }) {
    return { courseId: params.id }
  },

  data() {
    return {
      courseId: '',
      chapterList: [],
      course: {},
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      videoId: '', // 记录当前正在播放的videoId
      videoName: '', // 记录当前正在播放的小节名称
      player: null, // 播放器
      allTime: 0, // 总共观看时长，对应字段learning_time
      timer: {} // 计时器对象
    }
  },

  mounted() {
    this.initCourseInfo()
  },

  methods: {

    // 点击节点播放
    handleNodeClick(data) {
      if (typeof (data.children) !== 'undefined') {
        // 点到父节点直接return
        return
      }
      this.videoId = data.id
      this.videoName = data.title
      this.getPlayAuthById(data.id)
    },
    // 创建播放器
    getPlayer(vid, playAuth) {
      // eslint-disable-next-line no-undef
      this.player = new Aliplayer({
        id: 'J_prismPlayer',
        width: '100%',
        height: '480px',
        autoplay: true,
        vid: vid,
        playauth: playAuth,
        useH5Prism: true,
        skinLayout: [
          { name: 'bigPlayButton', align: 'blabs', x: 30, y: 80 },
          {
            name: 'H5Loading', align: 'cc'
          },
          { name: 'errorDisplay', align: 'tlabs', x: 0, y: 0 },
          { name: 'infoDisplay' },
          { name: 'tooltip', align: 'blabs', x: 0, y: 56 },
          { name: 'thumbnail' },
          {
            name: 'controlBar', align: 'blabs', x: 0, y: 0,
            children: [
              { name: 'progress', align: 'blabs', x: 0, y: 44 },
              { name: 'playButton', align: 'tl', x: 15, y: 12 },
              { name: 'timeDisplay', align: 'tl', x: 10, y: 7 },
              { name: 'fullScreenButton', align: 'tr', x: 10, y: 12 },
              { name: 'volume', align: 'tr', x: 5, y: 10 }
            ]
          }
        ],
        components: [{
          name: 'RateComponent',
          // eslint-disable-next-line no-undef
          type: AliPlayerComponent.RateComponent
        }]
      }, (player) => {
        // 创建完成之后获取上次播放进度
        staffVideo.getLastTime(this.videoId)
          .then(response => {
            console.log(response.data.data.lastTime)
            player.seek(response.data.data.lastTime)
          })
      })
      // 创建完成之后就开启各种事件
      // 初始化小节已学习时长
      this.allTime = 0
      // 启动定时器十秒记录一次播放进度
      this.recordTime()
      // 暂停时记录时长
      this.onPause()
      // 启动观看时记录时长
      this.onPlay()
      // 视频播放结束时记录时长
      this.onEnd()
    },
    // 获取播放凭证
    getPlayAuthById(id) {
      video.getPlayAuth(id)
        .then(response => {
          // 如果播放器对象为空就直接创建，不为空就替换vid和playAuth
          if (this.player === null) {
            this.getPlayer(response.data.data.videoSourceId, response.data.data.playAuth)
          } else {
            this.player.replayByVidAndPlayAuth(response.data.data.videoSourceId, response.data.data.playAuth)
          }
        })
    },
    // 获取课程详情
    initCourseInfo() {
      course.getCourseInfo(this.courseId)
        .then(response => {
          this.course = response.data.data.courseInfo
          this.chapterList = response.data.data.chapterInfo
          console.log(this.chapterList)
        })
    },

    // 播放时长记录相关方法
    // 定时器，每十秒钟获取当前视频播放到第几秒了
    recordTime() {
      // eslint-disable-next-line no-unused-vars
      var timer = setInterval(() => {
        var curTime = parseInt(this.player.getCurrentTime())
        if (this.player && this.player.getStatus() === 'playing') {
          // 调用一次接口，记录查看时间，这个时间对应的字段是last_time，就是为了完成video的继续播放功能
          staffVideo.lastVideoTime(this.videoId, curTime)
            .then(response => {
            })
        }
      }, 10000)
    },

    // 启动时统计时间发送
    onPlay() {
      var onPlayEvent = () => {
        // 启动计时器
        // 初始化学习时长
        if (isNaN(this.allTime)) {
          this.allTime = 0
        }
        this.timer = setInterval(() => {
          this.allTime += 1
        }, 1000)
        staffVideo.recordAllTime(this.videoId, this.allTime)
          .then(response => {
          })
      }
      this.player.on('play', onPlayEvent)
    },

    // 暂停时统计时间发送
    onPause() {
      // 每暂停一次发送一次数据
      var onPauseEvent = () => {
        // 关闭计时器
        clearInterval(this.timer)
        staffVideo.recordAllTime(this.videoId, this.allTime)
          .then(response => {
          })
        // 暂停记录学习时长后清0
        this.allTime = 0
      }
      this.player.on('pause', onPauseEvent)
    },

    // 播放完毕统计时间发送
    onEnd() {
      // 订阅播放完毕时的事件
      var onEndEvent = () => {
        // 关闭计时器
        clearInterval(this.timer)
        staffVideo.recordAllTime(this.videoId, this.allTime)
          .then(response => {
          })
        staffVideo.accomplishVideo(this.courseId, this.videoId)
          .then(response => {
          })
        // 播放完毕清零
        this.allTime = 0
        // 重新获取学习进度
        this.initCourseInfo()
      }
      this.player.on('ended', onEndEvent)
    }
  }
}
</script>
<style>
  .el-header{
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 100px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 600px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

</style>
