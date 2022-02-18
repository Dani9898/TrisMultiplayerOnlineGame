

/*
1. Una volta che siamo entrati, far scomparire il form. 		--DONE--

2. Il reset								--DONE--

3. Gestire il pareggio							

4. Dovremmo gestire le celle di vittoria, quindi illuminarle.

5. Frasi descrittive

6. Che i tasti sarebbero "crea nuova stanza" o "unisciti"
Crea stanza -> 
Unisciti ->

7. Nella stanza chiedere anche il nome (Slugify)


BONUS (m.2)

- Scegliere simbolo con la quale giocare
*/

var app = new Vue(
    {
        el: "#container",
        data: {
            storeClick: [],
            click: false,
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
            playerInput:'',
            stanzaInput:'',
            nomeInput: '',
            winner: false,
            ceilClick: 0
            
        },

        mounted(){

            this.toEmptyInput();
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
                // console.log('clickato' + coordinata);
                if (this.dbData.lastUser == undefined) {
                    this.click = false
                }
                if (!this.storeClick.includes(coordinata) && this.click === false && this.winner == false) {
                    this.storeClick.push(coordinata)
                    const res = await axios.get(`server.php?stanza=${this.stanza}&player=${this.player}&position=${coordinata}`)
                    .catch(e => console.error(e));

                    this.dbData = res.data;
                    this.ceilClick++;
                    // console.log(this.ceilClick);
                    // console.log('storeclick: ',this.storeClick.length);

                    if (res.data.winner) {
                        alert('partita finita ' + res.data.lastUser);
                        this.click = true;
                        this.winner = true;
                    }

                    console.log(this.dbData.nclick);

                    if (this.dbData.nclick == 9 && !this.winner) {
                        alert('Pareggio'); 
                        this.reset();
                    }

                    // console.log('user click',this.dbData.lastUser);
                    this.click = true;
                    // console.log(this.dbData);
                }
                // console.log(this.storeClick);
            },

            getData(){
                axios.get(`server.php?stanza=${this.stanza}`)
                    .then(r => {
                        this.dbData = r.data;
                        // console.log('last user',this.dbData.lastUser);
                        this.click = this.dbData.lastUser == this.player;

                        if (this.dbData.reset) {
                            this.dbData = {};
                            this.storeClick = [];
                        }
                        // console.log('click',this.click);
                    })
                    .catch(e => console.error(e));
            },

            toEmptyInput(){
                this.stanzaInput = '';
                this.playerInput = '';

            },

            reset() {
                this.dbData = {};
                this.storeClick = [];

                axios.get(`server.php?stanza=${this.stanza}&reset`)
                    .then(r => {})
                    .catch(e => console.error(e));
            },

            slug(str) {
                str = str.replace(/^\s+|\s+$/g, ''); // trim
                str = str.toLowerCase();
              
                // remove accents, swap ñ for n, etc
                var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
                var to   = "aaaaeeeeiiiioooouuuunc------";
                for (var i=0, l=from.length ; i<l ; i++) {
                    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
                }
            
                str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                    .replace(/\s+/g, '-') // collapse whitespace and replace by -
                    .replace(/-+/g, '-'); // collapse dashes
            
                return str;
            }

        },
    }
)