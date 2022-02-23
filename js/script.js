

/*
1. BUGFIX: combinazione vincente non combacia con quella colorata
2. BUGFIX: tasto reset compare solo a partita finita(pareggio o vittoria)
3. BUGFIX: puo vincere solo x


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
            // dati sulla partita
            storeClick: [],
            dbData: {},

            // gestione click
            click: false,

            // dati url
            player:'',
            stanza:'',

            // gestione input
            playerInput:'',
            stanzaInput:'',
            nomeInput: '',
            join: false,
            // gestisce il vincitore
            winner: false,

            // array dati sul vincitore
            winnerCombination: [],
        },

        mounted(){

            this.toEmptyInput();
            // valore url
            const queryString = window.location.search;
            // salvo l'url
            const urlParams = new URLSearchParams(queryString);
            // valore stanza
            this.stanza = urlParams.get('stanza');
            this.join = urlParams.get('join') ? true : false;

            // valore player
            this.player = urlParams.get('player');
            setInterval(this.getData, 1000);
        },

        methods: {
            // funzione che gestisce il click (asincrona)
            async clicked(coordinata) {

                // controllo primo click
                if (this.dbData.lastUser != this.player) {
                    this.click = false
                }

                // controllo generico click
                // se storeClick contiene la cella cliccata && click e' falso && winner e' falso
                if (!this.storeClick.includes(coordinata)
                    && !this.dbData[coordinata]
                    && this.click === false 
                    && this.winner == false) {

                        // pusho la coordinata nello storeClick
                        this.storeClick.push(coordinata)
                        // chiamata axios 
                        const res = await axios.get(`server.php?stanza=${this.stanza}&player=${this.player}&position=${coordinata}`)
                        .catch(e => console.error(e));
                        // salvo il risultato in dbData
                        this.dbData = res.data;
                        // valorizzo click con true (non posso cliccare)
                        this.click = true;

                        // controllo win
                        // se winner data esiste
                    if (res.data.winnerData) {
                        // creo un allert
                        alert('partita finita ' + res.data.lastUser);
                        // click e winner diventano'true'
                        this.click = true;
                        this.winner = true;
                        // valorizzo winnerCombination con l'array contente le posizioni delle celle vincenti
                        this.winnerCombination = res.data.winnerData.ceilWin;

                    }


                    // controllo pareggio
                    // se nClick(count dei click) = 9 e winner e' falso
                    if (this.dbData.nclick == 9 && !this.winner) {
                        alert('Pareggio'); 
                        this.reset();
                    }

                }
            },

            // call axios che torna i dati dal db(coordinate, winner, last user)
            getData(){
                axios.get(`server.php?stanza=${this.stanza}&player=${this.player}&join=${this.join}`)
                    .then(r => {
                        // salvo i dati
                        this.dbData = r.data;
                        // valorizzo click con false nel momento che lastuser non e' l'utente della pagina
                        this.click = this.dbData.lastUser == this.player;

                        // controllo reset
                        if (this.dbData.reset) {
                            // svuoto i dati della partita
                            this.dbData = {};
                            this.storeClick = [];

                            // valorizzo winner per reset classi
                            this.winner = false;
                        }

                        if (r.data.player) {
                            this.player = r.data.player;
                        }
                        // controllo win
                        if (r.data.winnerData.ceilWin !== undefined) {
                            this.winner = true;
                            // valorizzo winnerCombination con l'array contente le posizioni delle celle vincenti
                            this.winnerCombination = r.data.winnerData.ceilWin;
                        }

                    })
                    .catch(e => console.error(e));
            },

            // svuota gli input
            toEmptyInput(){
                this.stanzaInput = '';
                this.playerInput = '';

            },

            // reset game
            reset() {
                // svuoto i dati della partita
                this.dbData = {};
                this.storeClick = [];
            
                // valorizzo winner per reset classi
                this.winner = false;
                // avviso il back-end che la partita e' finita
                axios.get(`server.php?stanza=${this.stanza}&reset`)
                    .then(r => {})
                    .catch(e => console.error(e));
            },

            // gestisce il nome utente
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