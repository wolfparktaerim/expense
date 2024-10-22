<template>
    <SubNavigation />
    <Globe />
</template>

<script>
import SubNavigation from "../components/SubNavigation.vue";
import Globe from "../components/Globe.vue";

export default {
  name: 'SearchPage', 
  //  Local Component Registration
  components: {
    SubNavigation,
    Globe,
    
  },
}
</script>