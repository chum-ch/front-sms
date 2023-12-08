<template>
  <div>
    <custom-navigation :breadCrumb="breadCrumb" />
    <div class="hello flex">
      <custom-details :full_name="fullName" :email="email">
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
      // School
      schoolId: this.$route.params.schoolId,
      fullName: "",
      email: "",
      values: "",
      // BreadCrum
      breadCrumb: [],
      generationId: this.$route.params.generationId,
      // Tabl
      active: 0,
      items: [
        {
          label: "កាលវិភាគ",
          command: () => {
            this.testingClick();
          },
        },
        {
          label: "អវត្តមាន",
          command: () => {
            this.testingClick();
          },
        },
      ],
      viewInfo: [
        {
          label: "Generation name",
          key: "Name",
        },
      ],
    };
  },
  props: {
    msg: String,
  },
  emits: [""],
  watch: {},
  created() {
    this.getSchoolDetails(this.schoolId);
  },
  methods: {
    testingClick() {
      console.log("dd");
    },
    async getSchoolDetails(schoolId) {
      let school = await this.$api.school.getSchool(schoolId);
      if (school && school.data && Object.keys(school.data).length > 0) {
        school = school.data;
      }
      let generation = await this.$api.generation.getGeneration(
        this.schoolId,
        this.generationId
      );
      if (generation && generation.data && Object.keys(generation.data).length > 0) {
        generation = generation.data;
      }
      this.fullName = `${generation.Name}`;
      this.viewInfo = this.$globalFunction.sectionViewInfo(
        this.viewInfo,
        generation
      );

      this.breadCrumb = [
        { label: `${school.Name}`, to: "/" },
        { label: "Manages", to: `/schools/${schoolId}/manages` },
        {
          label: `${generation.Name}`,
          to: `/schools/${schoolId}/generations/${this.generationId}`,
        },
      ];
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
