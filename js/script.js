

var app = new Vue(
    {
        el: "#container",
        data: {
            storeClick: [],
            dbData: [
                {
                    '1_1': 'valore',
                    '1_2': 'valore',
                    '1_3': 'valore',
                    '2_1': 'valore',
                    '2_2': 'valore',
                    '2_3': 'valore',
                    '3_1': 'valore',
                    '3_2': 'valore',
                    '3_3': 'valore'
                }
            ],
        },
        methods: {
            clicked(coordinata) {
                console.log('clickato' + coordinata);
                if (!this.storeClick.includes(coordinata)) {
                    this.storeClick.push(coordinata)
                }
                console.log(this.storeClick);
            },

        },
        mounted(){

            const queryString = window.location.search;
            console.log(queryString);

            const urlParams = new URLSearchParams(queryString);
            const stanza = urlParams.get('stanza');
            const player = urlParams.get('player');
            console.log(stanza, player);
        }
    }
)