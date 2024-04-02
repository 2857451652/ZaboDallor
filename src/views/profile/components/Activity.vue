<template>
  <div class="user-activity">
    <div class="post">
      <div class="user-block">
        <img class="img-circle" src="../../../assets/images/school_white.png">
        <span class="username text-muted">BUPT</span>
        <span class="description">Shared publicly - 7:30 PM today</span>
      </div>
      <p>
        Beijing University of Posts and Telecommunications (BUPT) is a research-oriented university with information technology and telecommunications as its main feature. Founded in 1955, BUPT was originally named Beijing Institute of Posts and Telecommunications. It is the first institute of higher learning for teaching and research in the fields of posts and telecommunications. In 1993, it was authorized to rename as its present name BUPT.
        
        The university offers a wide range of subjects including engineering, management, humanities and sciences, and most of its subjects and disciplines are related to applied science and engineering. BUPT enjoys a nationwide reputation for innovation and excellence in advanced research and learning in information and communication technology. It serves as one of the most important teaching and research bases for information technology and telecommunication industry in China.
      </p>
      <ul class="list-inline">
        <li>
          <span class="link-black text-sm">
            <i class="el-icon-share" />
            Share
          </span>
        </li>
        <li>
          <span class="link-black text-sm">
            <svg-icon icon-class="like" />
            Like
          </span>
        </li>
      </ul>
    </div>
    <div class="post">
      <div class="user-block">
        <img class="img-circle" src="../../../assets/images/school_white.png">
        <span class="username text-muted">State Key Lab</span>
        <span class="description">Sent you a message - yesterday</span>
      </div>
      <p>
        The National Key Laboratory of Networking and Switching Technology, affiliated with Beijing University of Posts and Telecommunications, was approved by the State Planning Commission/State Education Commission in 1988 as one of the first national key laboratories under the World Bank loan key discipline development project. In 1989, the State Planning Commission approved the laboratory construction project, and in 1990, the laboratory construction was approved by the State Planning Commission/State Education Commission. The laboratory officially commenced operation and opened to the public in 1992. In 2005, it was renamed as the "National Key Laboratory of Switching Technology," with Academician Chen Junliang as the founder of the laboratory, and Professor Zhang Ping as the current director.
      </p>
      <ul class="list-inline">
        <li>
          <span class="link-black text-sm">
            <i class="el-icon-share" />
            Share
          </span>
        </li>
        <li>
          <span class="link-black text-sm">
            <svg-icon icon-class="like" />
            Like
          </span>
        </li>
      </ul>
    </div>
    <div class="post">
      <div class="user-block">
        <img class="img-circle" src="/images/tiansuanlogo.png">
        <span class="username">TianSuan</span>
        <span class="description">Posted 4 photos - 2 days ago</span>
      </div>
      <div class="user-images">
        <el-carousel :interval="6000" type="card" height="300px">
          <el-carousel-item v-for="item in carouselImages" :key="item">
            <img :src="item+carouselPrefix" class="image">
          </el-carousel-item>
        </el-carousel>
      </div>
      <ul class="list-inline">
        <li><span class="link-black text-sm"><i class="el-icon-share" /> Share</span></li>
        <li>
          <span class="link-black text-sm">
            <svg-icon icon-class="like" /> Like</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const avatarPrefix = '?imageView2/1/w/80/h/80'
const carouselPrefix = '?imageView2/2/h/440'

export default {
  data() {
    return {
      carouselImages: [
        '/images/show1.jpg',
        '/images/show2.jpg',
        '/images/show3.jpg',
        '/images/show4.jpg'
      ],
      avatarPrefix,
      carouselPrefix
    }
  }
}
</script>

<style lang="scss" scoped>
.user-activity {
  .user-block {

    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }

    .username{
      font-size: 16px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }

  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 15px;
    padding-bottom: 15px;
    color: #666;

    .image {
      width: 100%;
      height: 100%;

    }

    .user-images {
      padding-top: 20px;
    }
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }

    .link-black {

      &:hover,
      &:focus {
        color: #999;
      }
    }
  }

}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}
</style>
