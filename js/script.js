

var app = new Vue(
    {
        el: "#container",
        data: {
            storeClick: [],
            dbData: {
                    's1_1': '',
                    's1_2': '',
                    's1_3': '',
                    's2_1': '',
                    's2_2': '',
                    's2_3': '',
                    's3_1': '',
                    's3_2': '',
                    's3_3': ''
                },
            player:'',
            stanza:'',
            display: false,
            icon: 'fa-solid',
        },

        mounted(){

            // valore url
            const queryString = window.location.search;

            const urlParams = new URLSearchParams(queryString);
            // valore stanza
            this.stanza = urlParams.get('stanza');
            // valore player
            this.player = urlParams.get('player');

            setInterval(this.getData, 1000);
        },

        methods: {
            async clicked(coordinata) {
                console.log('clickato' + coordinata);
                if (!this.storeClick.includes(coordinata)) {
                    this.storeClick.push(coordinata)
                    const res = await axios.get(`http://localhost:81/server.php?stanza=${this.stanza}&player=${this.player}&position=${coordinata}`)
                    .catch(e => console.error(e));
                    this.dbData = res.data;
                    console.log(this.dbData);
                }
                console.log(this.storeClick);
            },

            getData(){
                axios.get(`http://localhost:81/server.php?stanza=${this.stanza}`)
                    .then(r => this.dbData = r.data)
                    .catch(e => console.error(e));
                    console.log('ciao');
            }

        },
    }
)