Vue.component('oss-license', {
  props: {
    "name": String,
    "spdx_id": String,
    "url": String,
    "node_id": String
  },
  template: '<strong class="ui label" v-if="this.spdx_id" v-bind:class="howScary">{{ name }}</strong>',
  computed: {
    howScary() {
      let ok = undefined !== this.spdx_id && this.spdx_id.toLowerCase().indexOf('gpl') == -1 && this.spdx_id !== 'NOASSERTION';
      return {red: !ok, green: ok};
    }
  }
});

Vue.component('repo-list-item', {
  props: ['repo'],
  data() {
    return {
      repo: {
        "id": 0,
        "name": "",
        "full_name": "",
        "node_id": "",
        "html_url": "",
        "created_at": "",
        "updated_at": "",
        "pushed_at": "",
        "language": "",
        "license": ""
      }
    };
  },
  computed: {
    created() {
      return this.repo.created_at.split('T')[0];
    },
    updated() {
      return this.repo.updated_at.split('T')[0];
    }
  },
  template: `
  <li>
    <a v-bind:href="repo.html_url">{{ repo.name }}</a>
    <oss-license v-bind="repo.license"></oss-license>
    <br /><date>{{ created }}</date> - <date>{{ updated }}</date>
  </li>`
});


new Vue({
  el: "#app",
  computed: {
    org_url() {
      return `https://api.github.com/users/${this.org_login}`;
    },
    licensed() {
      return this[this.focus].filter((repo) => repo.license);
    },
    unlicensed() {
      return this[this.focus].filter((repo) => !repo.license);
    },
    forks() {
      return this.repos.filter((repo) => repo.fork);
    },
    sources() {
      return this.repos.filter((repo) => !repo.fork);
    }
  },
  created() {
    this.getOrg();
  },
  data() {
    return {
      org_login: 'BigBlueHat',
      org: {},
      repos: [],
      focus: 'repos'
    };
  },
  methods: {
    getOrg() {
      fetch(this.org_url)
        .then(r => r.json())
        .then(org => {
          this.org = org;
          return org.repos_url + '?per_page=100';
        }).then(url => {
          fetch(url).then(r => r.json()).then(repos => {
            this.repos = repos;
          });
        }).catch();
    }
  }
});
