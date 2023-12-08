<template>
  <div class="w-4 shadow-2 my-4 mx-auto py-2">
    <form action="" class="px-4">
      <div class="image d-flex justify-content-center flex-wrap p-2">
        <img
          src="../../assets/img/school-1.png"
          alt=""
          srcset=""
          width="130"
          class="cursor-pointer"
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
          :label="'ទាមទារ ការបញ្ចូលពាក្យសម្ងាត់'"
          :placeholder="'ពាក្យសម្ងាត់ '"
          class="mb-3"
          :required="true"
          :eye_icon="true"
        />
      </div>
      <span class="text-primary cursor-pointer hover:underline" @click="$event=>resetPassword()">
        បំភ្លេចពាក្យសម្ងាត់
      </span>
      <p class="mt-3">
        តើអ្នកមានគណនីហើយឬនៅ? បើនៅ
        <span class="text-primary cursor-pointer hover:underline"
          >បង្កើតគណនី</span
        >
      </p>
      <div class="d-flex justify-content-end mb-2">
        <!-- <custom-button :label="'បោះបង់'" class="mr-6" :text="true" /> -->
        <custom-button :label="'ចូលប្រើ'" class="w-4" />
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
    resetPassword(){
      this.$router.push('/reset-password')
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
