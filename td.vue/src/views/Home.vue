<template>
  <b-container>
    <b-jumbotron>
      <b-row class="text-center mb-2">
        <b-col md=12>
          <h1 class="display-3 text-center">OWASP Threat Dragon</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col md=4>
          <b-img alt="Threat Dragon Logo" src="@/assets/threatdragon_logo_image.svg" />
        </b-col>
        <b-col md=8>
          <b-row>
            <p>
              Threat Dragon is a free, open-source threat modeling tool from OWASP. It can be used
              as a standalone desktop app for Windows, MacOS and Linux or as a web application. The
              desktop app is great if you want to try the application without giving it access to
              your GitHub repos, but if you choose the online version you get to unleash the awesome
              power of GitHub on your threat models! Obviously, to do this you need to log in first.
            </p>
          </b-row>
        </b-col>
      </b-row>
    </b-jumbotron>
  </b-container>
</template>

<script>
export default {
  name: 'Home'
}
</script>
