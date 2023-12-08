<template>
  <div
    class="w-4 shadow-2 rounded-2 position-absolute top-50 start-50 translate-middle"
    style="box-sizing: border-box"
  >
    <form action="" class="px-4">
      <div class="image d-flex justify-content-center flex-wrap my-4">
        <img
          src="../../assets/img/school-1.png"
          alt=""
          srcset=""
          width="130"
          class=""
        />
        <h6 class="w-100 text-center text-warning">
          <span class="text-help">គេហទំព័រការគ្រប់គ្រងសាលារៀន</span>
        </h6>
        <h6 class="w-100 text-center text-warning">
          <span class="text-help">សូមស្វាគមន៍!</span>
        </h6>
      </div>
      <div>
        <custom-input-text
          :label="'ទាមទារ ការបញ្ចូលអ៊ីមែល'"
          class="mb-4"
          :placeholder="'អ៊ីមែល '"
          :required="true"
          :show_icon="true"
          :email_icon="true"
          :right_icon="true"
        />

        <custom-input-password
          :label="'ទាមទារ ការបញ្ចូលពាក្យសម្ងាត់ថ្មី'"
          :placeholder="'ពាក្យសម្ងាត់ថ្មី '"
          class="mb-3"
          :required="true"
          :eye_icon="true"
        />
      </div>
      <p>
        តើអ្នកមានគណនីហើយឬនៅ? បើនៅ
        <span class="text-primary cursor-pointer hover:underline"
          >បង្កើតគណនី</span
        >
      </p>
      <div class="d-flex justify-content-end mb-4">
        <custom-button @click="$event=>loginForm()" :label="'បោះបង់'" class="mr-3" :outlined="true" />
        <custom-button :label="'កំណត់ជាថ្មី'" class="w-4" />
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    msg: String,
  },
  data() {
    return {};
  },
  created() {},
  components: {},
  watch: {},
  methods: {
    loginForm(){
      this.$router.push('/login')
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
