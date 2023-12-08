<template>
  <div class="overflow-hidden h-screen">
    <custom-navigation :breadCrumb="breadCrumb" />
    <div class="gap-2 p-2" style="display: grid; grid-template-columns: 30% 70%">
      <custom-people-profile
        :fullName="fullName"
        :email="email"
        :ProfileURL="ProfileURL"
        @onClick="changProfile"
      >
        <template #view_info>
          <custom-view-info
            v-for="(item, index) in itemsViewInfo"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </custom-view-info>
        </template>
      </custom-people-profile>
      <custom-tab :dataTabs="dataTabs" class="pe-2">
        <template #DetailsStudent>
          <img :src="myImge" alt="" />
         
        </template>
        <template #Schedule>
          <custom-full-calendar />
        </template>
      </custom-tab>
    </div>
    <custom-crop-img ref="refToChildCropImg" @image="handleSubmit" />
  </div>
</template>

<script>
// import StudentsList from "./StudentsList.vue";
export default {
  components: {
    // StudentsList,
  },
  data() {
    return {
      ProfileURL: "",
      myImge: "",
      // Profile
      fullName: "",
      email: "",
      // Bread crumb
      breadCrumb: [],
      itemsViewInfo: [
        {
          label: "Gender",
          path: "Gender",
        },
        {
          label: "Province",
          path: "",
        },
        {
          label: "ID",
          path: "ID",
        },
        {
          label: "Generation name",
          path: "GenerationName",
        },
        {
          label: "Class",
          path: "Class.Name",
        },
        {
          label: "Room",
          path: "Class.Room.Name",
        },
      ],
      // Tabs
      dataTabs: [
        {
          TabName: "Overview",
          ComponentName: "DetailsStudent",
        },
        {
          Active: true,
          TabName: "Schedule",
          ComponentName: "Schedule",
        },
      ],
      // School id
      schoolId: this.$route.params.schoolId,
      // Generation id
      generationId: this.$route.params.generationId,
      // Student id
      studentId: this.$route.params.studentId,
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
    changProfile() {
      this.$refs.refToChildCropImg.openDialogCropImg();
    },
    async handleSubmit(imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      const uploadImage = await this.$api.student.uploadImage(this.studentId, formData);
      this.ProfileURL = uploadImage.data.ProfileURL;
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
      let student = await this.$api.student.getStudent(
        this.schoolId,
        this.generationId,
        this.studentId
      );
      if (student && student.data && Object.keys(student.data).length > 0) {
        student = { ...student.data, GenerationName: generation.Name };
        this.ProfileURL = student.ProfileURL;
        this.fullName = `${student.LastName} ${student.FirstName}`;
        this.email = student.Email;
        this.itemsViewInfo = this.$globalFunction.getValueNtestedObject(
          this.itemsViewInfo,
          student
        );
      }
      this.breadCrumb = [
        { label: `${school.Name}`, to: "/" },
        { label: "Manages", to: `/schools/${schoolId}/manages` },
        {
          label: `${generation.Name}`,
          to: `/schools/${schoolId}/generations`,
        },
        {
          label: "Students",
          to: `/schools/${this.schoolId}/generations/${this.generationId}/students`,
        },
        {
          label: this.fullName,
          to: `/schools/${this.schoolId}/generations/${this.generationId}/students/${this.studentId}`,
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
.aaa {
  overflow-y: scroll;
  height: 100vh;
}
</style>
