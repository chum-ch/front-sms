<template>
  <div>
    <custom-navigation :breadCrumb="breadCrumb" />
  <div class="hello flex">
    <custom-details
    :full_name="fullName"
    >
    <template #view_info>
      <custom-view-info :items_view_info="viewInfo" />
    </template>
    <template #view_tab>
      <tab-menu-primevue v-model:activeIndex="active" :model="items" />
    </template>
    </custom-details>

  </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      fullName: "",
      values: "",
      // BreadCrum 
       breadCrumb: [{ label: "អ្នកសម្អាត", to: "/cleaners" }],
      // Tabl
      active: 0,
      items: [
        {
          label: "កាលវិភាគ",
          command: () => {
            this.testingClick();
          },
        },
      ],
      viewInfo: [
        {
          label: "នាមត្រកូល",
          key: "LastName",
        },
        {
          label: "នាមខ្លួន",
          key: "FirstName",
        },
        {
          label: "ភេទ",
          key: "Gender",
        },
        {
          label: "លេខទូរសព្ទ",
          key: "Phone",
        },
        {
          label: "ខេត្ដ",
          key: "Province",
        },
      ],
    };
  },
  props: {
    msg: String,
  },
  emits: [""],
  watch: {
  },
  created() {
    this.detailsCleaner(this.$route.params.id);
  },
  methods: {
    testingClick() {
      console.log("dd");
    },
    async detailsCleaner(id) {
      try {
        if(id){
          let getCleaner = await this.$api.school
            .cleaner()
            .getCleaner(id);
          if (getCleaner.data) {
            this.fullName = `${getCleaner.data[0].LastName} ${getCleaner.data[0].FirstName}`
           this.viewInfo = this.$globalFunction.sectionViewInfo(this.viewInfo, getCleaner.data[0])
           this.breadCrumb.push({ label: `${this.fullName}`, to: `/trainers/${this.$route.params.id}` })
          }
        }
      } catch (error) {
        console.log('Details trainer error', error);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  margin: 0;
  padding: 0;
}
</style>
