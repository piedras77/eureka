  (function () {
    'use strict';

    var TESTING_PATH = 'http://localhost:8080/rest/';
    var BASE_PATH = 'https://baker-ws-dev.herokuapp.com/rest/';

    angular
    .module('app.core')
    .constant('CORE', {
      'API_URL': BASE_PATH,
      'LANGUAGE': {ENGLISH: 0, SPANISH: 1},
      'INTERROGATIVES_CODES': {
        'who': 'XZ1','what': 'YZ','which': 'XZ2','where': 'XZ3','how': 'XZ5',
        'when': 'XZ4', 'how much': 'XZ5','how many': 'XZ7','why': 'XZ6'
      },
      'PROFILE_PICTURE': [
        'african', 'arab', 'astronaut', 'batman', 'boy-1', 'boy-2', 'boy-3', 'boy-4', 'boy-5', 'british', 'captain-america', 'chinese', 'chinese-girl',
        'darth-vader', 'doctor-m', 'doctor-w', 'egyptian', 'egyptian-girl', 'eve', 'firefighter', 'frankenstein', 'french', 'french-girl', 'german-girl', 'girl-1',
        'girl-2', 'girl-4', 'girl-6', 'girl-7',  'hacker', 'hippie', 'holland', 'indian', 'indian-girl', 'japanese', 'man', 'mexican', 'mexican-girl', 'native-american',
        'native-american-girl', 'ninja', 'pirate', 'pirate-girl', 'policeman',
        'prisoner', 'r2d2', 'rasta', 'swimmer', 'spy', 'thief', 'wall-e'
      ],
        'EXPLANATIONS': {
         EM: ['Adverbs that modify verbs typically answer questions such as how the action occurs, where the action takes place, or under which conditions. For example, in the sentence "He is always ready to work" the adverb always qualifies the verb work.',
         'Los adverbios que se usan para modificar verbos, típicamente responden a preguntas tales como cómo ocurre la acción, dónde ocurre la acción o bajo qué condiciones. Por ejemplo, en la oración "He is always ready to work" el adverbio siempre califica el verbo trabajar'],

         EA: ['Adverbs that work to modify  adjectives typically give extra qualities or information about the adjective.',
         'Los adverbios que cumplen la función de modificar adjetivos típicamente dan cualidades extra o información acerca del adjetivo'],

         ET: ['Adverbs of time tell us how often, they express the frequency of an action.',
         'Los adverbios de tiempo se utilizan para expresar la frecuencia de una acción.'],

         EP: ['Adverb of place talk about the location where the action of the verb is being carried out. Adverbs of place are normally placed after a sentence\'s object or main verb.',
         'Los adverbios de lugar normalmente hablan sobre la localización donde se está desarrollando la acción. Normalmente se encuentran después del sujeto o el verbo principal.'],

         EMM: ['Adverbs of manner are used to tell us the way or how something is done, for example in the phrase “the man ran quickly” the word quickly is telling us how the action took place.',
         'Los adverbios de modo se utilizan para describir la manera en la que la acción se desarrolla'],

         ED: ['Adverbs of degree tell us about the intensity or degree of an action, an adjective or another adverb.',
         'Los adverbios de grado se utilizan para demostrar la intensidad en la que se desarrolla una acción.'],

         EC: ['Adverbs are used for modifying verbs, they typically answer questions such as how the action occur, where the action takes place, or under which conditions.',
         'Los adverbios se usan para modificar verbos, típicamente responden a preguntas tales como cómo ocurre la acción, dónde ocurre la acción o bajo qué condiciones.'],

         ER: ['Adverbs of reason tell us why something happened.',
         'Los adverbios de propósito indican porque una acción se llevó a cabo'],

         APP: ['Adjectives that modifying pronouns often tell us colors, sizes or other descriptions.',
         'Los adjetivos que usan para modificar pronombres. A menudo nos dicen colores, tamaños u otras descripciones.'],

         AP: ['Possessive adjectives are used to express possession over an object. Some examples of this type of adjective are “his,my,hers” .',
         'Los adjetivos posesivos se utilizan para expresar posesión, algunos ejemplos son “suyo, mío, tuyo”'],

         AA: ['Adjectives are used for modifying nouns and pronouns. They often tell us colors, sizes or other descriptions.',
         'Los adjetivos se usan para modificar sustantivos y pronombres. A menudo nos dicen colores, tamaños u otras descripciones.'],

         AD: ['Demonstrative adjectives are adjectives that are used to modify a noun so that we know which specific person, place, or thing is mentioned.',
         'Los adjetivos demostrativos son aquellos adjetivos que se utilizan para modificar un sustantivo para indicar que persona, lugar o cosa en específico es mencionada..'],

         AI: ['An indefinite adjective is an adjective formed from an indefinite pronoun. The most common indefinite pronouns are: all, any, anyone, anything, each, everybody, everyone.',
         'Los adjetivos indefinidos son adjetivos que se forman de un pronombre indefinido.'],

         A$: ['Numeral Adjectives are those adjectives which are used to denote the number of nouns or the order in which they stand.',
         'Los adjetivos numerales son aquellos adjetivos que se utilizan para expresar el número específico de sustantivos o su orden.'],

         AN:  ['Adjectives that modify nouns are used according to the noun. For example, in the phrase "tall girl". The word tall is modifying the noun girl.',
         'Los adjetivos que modifican sustantivos varían dependiendo del sustantivo. Por ejemplo, en la phrase "mujer alta". La palabra alta modifica a las cualidades del sustantivo mujer.'],

         NC: [ 'Common nouns are words used to name general items rather than specific ones. Some examples of common nouns are: women, computer, paper.',
         'Los sustantivos comunes se usan para referirse a artículos en general en vez de a uno en específico.. Algunos ejemplos son: mujer, computadora, papel.'],

         NP: ['Proper nouns name a specific one-of-a-kind item. Furthermore they begin with capital letters.',
         'Los sustantivos propios nombran un objeto en particular, son caracterizados por empezar con mayúscula.'],

         NCA: ['Abstract nouns are used to refer to a category of nouns that cannot be physically touched or seen. For example: feelings and joy.',
         'Los sustantivos abstractos se refieren a palabras que no pueden ser vistas ni tocadas físicamente. Por ejemplo: sentimientos y alegría'],

         NCCC: ['Compound nouns are a type of noun used to refer to nouns composed by more than one word. For example: lion cage.',
         'Los sustantivos compuestos se refieren a sustantivos que incluyen más de una palabra. Por ejemplo: jaula de leones'],

         NCC: ['Collective nouns are names for a collection or a number of people, animals or things. For example: herd, and a flock of fish',
         'Los sustantivos colectivos representan una colección o un grupo de personas, animales o cosas. Algunos ejemplos son: rebaño, banco de peces'],

         NCT: ['Concrete nouns are things that you can experience through your five senses: sight, smell, hearing, taste, and touch.',
         'Los sustantivos concretos son esos que se pueden experimentar por los sentidos. Ya sea por el gusto, la vista, el olfato, el oído o el tacto'],

         NCG: ['Gender specific nouns refer particularly to a male or female. Their gender never changes. Some examples are: dad, bull. ',
         'Los sustantivos de género se refieren específicamente a un hombre o una mujer. Algunos ejemplos son: papá, toro.'],

         NCV: ['Verbal nouns are those that are formed by inflection of a verb and partly sharing its constructions, such as smoking in: smoking is forbidden',
         'Los sustantivos verbales son aquellos que se forman por un verbo, y tienen un rol en su construcción. Un ejemplo es: fumar está prohibido.'],

         NCGG: ['Gerund nouns are those that are derived from a verb but that functions as a noun, in English ending in -ing. For example the word asking in the following sentence:  do you mind my asking?',
         'Los sustantivos gerundio son aquellos que se derivan de un verbo pero funcionan como un sustantivo y terminan con ing.'],

         NCU: ['Uncountable nouns are those that cannot be divided into particular elements. For example: Milk',
         'Los sustantivos incontables son aquellos que no se pueden dividir en objetos particulares. Por ejemplo la palabra leche. Podemos contar litros o botellas de leche pero no leche en si'],

         CC: ['Conjunctions are used in order to connect words or phrases. The most common conjunctions are: and, but, for, or, nor, yet, and so. ',
         'Las conjunciones se utilizan para conectar palabras o frases. Las conjunciones más comunes son: y, pero, para, o, ni, todavía, y así.'],

         CO: ['Conjunctions are used in order to connect words or phrases. The most common conjunctions are: and, but, for, or, nor, yet, and so.',
         'Las conjunciones se utilizan para conectar palabras o frases. Las conjunciones más comunes son: y, pero, para, o, ni, todavía, y así.'],

         CS: ['Conjunctions are used in order to connect words or phrases. The most common conjunctions are: and, but, for, or, nor, yet, and so.',
         'Las conjunciones se utilizan para conectar palabras o frases. Las conjunciones más comunes son: y, pero, para, o, ni, todavía, y así.'],

         R: ['Prepositions are used in order to express location, or other types of relationships between nouns, pronouns and other parts of a sentence.',
         'Las preposiciones se usan para expresar la localización o otros tipos de relaciones entre sustantivos, pronombres y otras partes de una oración.'],

         VP: ['Verbs are used to express an action, state, or occurrence, they are divided into three main groups: past, present and future.',
         'Los verbos se usan para expresar una acción, estado o ocurrencia, se dividen en tres grupos principales: pasado, presente y futuro.'],

         PP: ['Pronouns are used to replace a noun. Some examples are: I, me, he, she, herself, you, it, that, they.',
         'Los pronombres se utilizan para reemplazar un sustantivo. Algunos ejemplos son: yo, yo, él, ella, ella misma, tú, eso, eso, ellos.'],

         Articles: ['Articles are used to indicate a noun and its function. They are placed before the noun.',
         'Los artículos se usan para indicar un sustantivo y su función. Se colocan ante el sustantivo.'],

         VU: ['Past tenses are used for actions that already finished', 'los verbos en pasado se usan para acciones que ya terminaron'],

         VQ: ['The form of a verb, typically ending in -ed in English, that is used in forming perfect and passive tenses and sometimes as an adjective, e.g., looked in have you looked? and lost in lost property',
         'El participio de pasado o "past participle" es una forma verbal no personal. Puede funcionar como adjetivo o como verbo en los tiempos compuestos en la oración. Es conocido también como "-ed form" ya que se construye añadiendo dicho sufijo a los verbos regulares'],

         VR: ['Present perfect is used to express a past event that has present consequences',
          'El presente perfecto progresivo es un tiempo verbal en el idioma inglés que narra hechos que ya han ocurrido en un momento específico o en el pasado pero que siguen teniendo una relevancia en el presente'],

         VG: ['Present tense expresses an action that is currently going on or habitually performed, or a state that currently or generally exists',
          'Los verbos en presente son aquellos que se utilizan para expresar la acción que se realiza en el momento actual'],

         VC: ['Simple form is a type of verb that is considered the basic form of a verb. Some examples are play-played.',
         'Los verbos en forma simple son considerados la forma básica del verbo. Algunos ejemplos son: juar-jugado.'],

         VTB: ['In general the verb to be is used to state a form of being to a particular subject',
         'En general el verbo ser o estar se utiliza para referirse al estado del sujeto'],

         VTB1: ['The verb am is the first person singular present indicative of be.',
         '"soy" o "ser" es el verbo de la primera persona presente indicativo de ser.'],

         VTB2: ['"Are" is the form of the “verb to be” that is used with when "you, we, or they" is the subject.',
         '"are" significa "eres, somos, o son". Es la forma del verbo ser que se utiliza con el sujeto "tú" como en "tú eres"'],


         VTB3: ['"Is" is the form of the verb "to be" that is used to represents a singular subject (he, she, it).',
         '"Es" es la forma singular del verbo "ser" que se utiliza para dirigirse a un sujeto singular como "el, ella o eso"'],

         VTB4: ['Are is the form of the verb to be that us used to represent  more than one subject.',
         'Son es la forma del verbo ser que se utiliza para dirigirse a más de un sujeto (un sujeto plural)'],

         VTB5: ['Are is the form of the verb to be that us used to represent  more than one subject.',
         'Son es la forma del verbo ser que se utiliza para dirigirse a más de un sujeto (un sujeto plural)'],

         VTB6: ['Are is the form of the verb to be that us used to represent  more than one subject.',
         'Son es la forma del verbo ser que se utiliza para dirigirse a más de un sujeto (un sujeto plural)'],

         VTBSF: ['EXPLANATION TO BE', 'EXPLICACIóN DE TO BE'],

         VTH: ['Verb "to have" implies the meaning of possession', 'El verbo "to have" implica posesión de algo o haber, como haber hecho un acción'],

         VTH1: ['"Have" is the form of the verb “to have” that is used to represent more than one subject or the subjects "you" and "I"',
         'Tienen/tiene es la forma del verbo tener que se utiliza para dirigirse a más de un sujeto'],

         VTH2: ['"Have" is the form of the verb to have that is used to represent more than one subject or the subjects "you" and "I"',
         'Tienen/tiene es la forma del verbo tener que se utiliza para dirigirse a más de un sujeto'],

         VTH3: ['"Has" is the form of the verb to have that is used to represent a singular subject',
         'Tiene es la forma del verbo tener que se utiliza para dirigirse a un solo sujeto'],

         VTH4: ['"Have" is the form of “the verb” to have that is used to represent more than one subject or the subjects "you" and "I"',
         'Tienen/tiene es la forma del verbo tener que se utiliza para dirigirse a más de un sujeto'],

         VTH5: ['"Have" is the form of the verb “to have” that is used to represent more than one subject or the subjects "you" and "I"',
         'Tienen/tiene es la forma del verbo tener que se utiliza para dirigirse a más de un sujeto'],

         VTH6: ['"Have" is the form of the verb “to have” that is used to represent more than one subject or the subjects "you" and "I"',
         'Tienen/tiene es la forma del verbo tener que se utiliza para dirigirse a más de un sujeto'],

         PP1: ['The pronoun  “I” is a personal, first person, singular pronoun.',
         'El pronombre yo es un pronombre personal de la primera persona singular'],

         PP2: ['The pronoun “you” is a personal pronoun that could be either singular or plural, it is a second person plural.',
         'El pronombre usted es el pronombre personal  de la segunda persona que se puede utilizar de manera singular o plural.'],

         PP3: ['The pronoun “he” is the personal male,third person, singular pronoun, and the pronoun she is the personal female,third person, singular pronoun.',
         'El pronombre “él” es un pronombre personal masculino de la tercera persona singular y el pronombre ella es un pronombre personal  femenino de la tercera persona singular.'],

         PP4: ['Pronouns are used to replace a noun. ',
         'El pronombre nosotros es un pronombre personal masculino de la primera persona plural'],

         PP5: ['The pronoun “we” is the first person, plural personal pronoun, it is used to refer to a group of people that includes the speaker.',
         'El pronombre nosotros es el pronombre personal de la primera persona plural, se utiliza para referirse a un grupo de personas que incluye al hablante.'],

         PP6: ['The pronoun “they” is a personal,third person, plural pronoun used to refer to a group of people.',
         'El pronombre ellos es un pronombre personal, plural de la tercera persona usado para referirse a un grupo de personas.'],

         PP7: ['Pronouns are used to replace a noun.',
         'Los pronombres se utilizan para reemplazar un sustantivo. "i" significa Yo'],

         PII: ['PRONOUN INDEFINITE EXPLANATION', 'los pronombres indefinidos se utilizan para mencionar cualquier cantidad, persona, lugar, etc. sin especificar cuál exactamente'],

         PRR: ['A relative pronoun is used to connect a clause or phrase to a noun or pronoun. You see them used every day with the most common relative pronouns being: who, whom, which, whoever, whomever, whichever, and that.',
         'Los pronombres relativos se usan para unir dos cláusulas, la segunda calificando al sujeto de la primera'],


         VX: ['The verb is used to talk about future actions regarding the speaker', 'este verbo es usado para referirse a futuras acciones en relación al hablante.'],

         AA: ['Articles are used to indicate a noun and its function. They are placed before the noun.',
         'Los artículos se usan para indicar un sustantivo y su función. Se colocan ante el sustantivo.'],

         XZ1: [' “Who” is the interrogative used to refer to a specific subject. For example "Who is chasing the cat?"',
         'Quien es el interrogativo utilizado para referirse a un sujeto en específico. Por ejemplo "Quien persigue al gato?"'],

         XZ2: [' “Which” is used when asking for information specifying one or more people or things from a definite set.',
         'Cual es utilizado para referirse a una persona o objeto en particular que pertenece a un grupo.'],

         YZ: [' “What” is the interrogative used for various purposes, for example to refer to one object of a group. For example, What time is it?',
         'Que es el interrogativo utilizado con varios propósitos, por ejemplo para referirse a un objeto entre varios. Por ejemplo "Qué hora es?"'],

         XZ6: [' “Why”, is the interrogative used when searching for a cause and an explanation. For example, "Why did you break the window?"',
         'Porque es e interrogativo utilizado cuando se busca una causa o una explicación. Por ejemplo "Porque quebraste la ventana?"'],

         PD1: [' ”This” is the pronoun used to represent a singular object nearby',
         'éste es el pronombre demostrativo que se utiliza para representar un objeto cercano al hablante'],

         PD2: [' “That” is the pronoun used to represent a singular object far away.', 'Aquél es el pronombre demostrativo que se utiliza para representar un objeto a la distancia'],

         PD3: ['The pronoun “these” is used to represent multiple objects nearby. ', 'Éstos es el pronombre demostrativo que se utiliza para representar múltiples objetos cercanos al hablante.'],

         PD4: ['The pronoun “those” is used to represent multiple objects far away.', 'Esos es el pronombre demostrativo que se utiliza para representar múltiples objetos a la distancia del hablante.'],

         CPS: [' “Complete subject” is the main word or words in a subject, along with any of the modifiers that might describe the subject. In order to find the complete subject you should ask who or what completes the action.',
          'Sustantivo completo es la palabra o palabras que forman el sujeto, incluyendo cualquier otro modificador. Para lograr encontrar el sujeto completo es necesario preguntar quién o qué completa la acción.'],

         PRDC: ['The predicate is the part of a sentence or clause containing a verb and stating something about the subject ', 'El predicado es la parte de una oración que incluye el verbo y da información acerca del sujeto'],

         PPP1: [' “Mine” is the possessive pronoun used to refer to things belonging to or associated with the speaker.',
         'Mío es el pronombre posesivo utilizado para demostrar posesión por el hablante.'],

         PPP2: [' “Yours” is the possessive pronoun used to refer to things in second person.',
         'Tuyo es el pronombre posesivo utilizado para demostrar posesión en segunda persona.'],

         PPP3: [' “His” is the possessive pronoun of he.', 'Suyo es el pronombre posesivo masculino.'],

         PPP3: [' “Hers” is the possessive pronoun of she.', 'Suya es el pronombre posesivo femenino.'],

         PPP4: [' “Ours” is used to refer to a thing or things belonging to the speaker and one or more other previously mentioned people.',
         'Nuestro es el pronombre posesivo de la primera persona plural.'],

         PPP7: [' “Their” is the possessive pronoun used to identify things belonging to or associated with the people previously mentioned.',
         'Su es el pronombre posesivo plural de la tercera persona.'],

         "UAE": ['<<Explicación no disponible aún>>','<<Explicación no disponible aún>>'],

         PI: ['Interrogative pronouns are those used to make a question easier.They are only 5 types of interrogative pronouns and they are: who, whom, whose, which, what',
         'Los pronombres interrogativos tienen la función de facilitar la construcción de preguntas. Los pronombres interrogativos son: quien, quienes, cual, que'],

         PII: ['Indefinite pronouns are those do not refer to any specific person, thing or amount. It is vague and "not definite". Some examples are: all, another, any, anybody/anyone, anything, each',
          'Los pronombres indefinidos son aquellos que no se refieren a una persona, cosa o cantidad en particular. Algunos ejemplos son: todos, otro, cualquiera.'],
       },
       'CODES_MEANING': {
         "NC": ["common noun", "sustantivo común"], "NCA": ["abstract noun","sustantivo abstracto"], "NCC": ["collective noun", "sustantivo colectivo"],
         "NCCC": ["compound noun", "sustantivo compuesto"], "NCT": ["concrete noun", "sustantivo concreto"], "NCG": ["gender specific noun", "sustantivo específico de género"],
         "NCV": ["verbal nouns ", "sustantivo verbal"], "NCGG": ["Gerund noun", "sustantivo gerundio"], "NCU": ["uncountable nouns", "sustantivos incontables"],
         "NP": ["sustantivos propios","proper nouns"], "PP": ["personal pronoun", "pronombre personal"], "PP1":["personal pronoun 1", "pronombre personal 1"],
         "PP2": ["personal pronoun 2", "pronombre personal 2"], "PP3": ["personal pronoun 3", "pronombre personal 3"], "PP4": ["personal pronoun 4", "pronombre personal 4"],
         "PP5": ["personal pronoun 5", "pronombre personal 5"], "PP6": ["personal pronoun 6", "pronombre personal 6"], "PP7": ["personal pronoun 7", "pronombre personal 7"],
         "PD": ["demonstrative pronoun", "pronombre demostrativo"], "PD1": ["demonstrative pronoun 1", "pronombre demostrativo 1"], "PD2": ["demonstrative pronoun 2", "pronombre demostrativo 2"],
         "PD3": ["demonstrative pronoun 3", "pronombre demostrativo 3"], "PD4": ["demonstrative pronoun 4", "pronombre demostrativo 4"], "PI": ["interrogative pronoun", "pronombre interrogativo"],
         "PII": ["indefinite pronoun", "pronombre indefinido"],"PPP": ["possessive pronoun", "pronombre posesivo"], "PPP1": ["possessive pronoun", "pronombre posesivo 1"],
         "PPP2": ["possessive pronoun 2", "pronombre posesivo 2"], "PPP3": ["possessive pronoun 3", "pronombre posesivo 3"], "PPP4": ["possessive pronoun 4", "pronombre posesivo 4"],
         "PPP5": ["possessive pronoun 5", "pronombre posesivo 5"], "PPP6": ["possessive pronoun 6", "pronombres posesivos 6"], "PR": ["reciprocal pronoun", "pronombre recíproco"],
         "PRR": ["relative pronoun", "pronombre relativo"],"PRP": ["reflexive pronoun", "pronombre reflexivo"], "AN": ["adjectives that modify nouns", "adjetivos que modifican sustantivos"],
         "APP": ["adjectives that modify pronouns", "adjetivos que modifican pronombres"], "AP": ["possessive adjectives", "adjetivos posesivos"],
         "AA": ["adjectives that modify articles ", "adjetivos que modifican pronombres"], "AD": ["demonstrative adjectives", "adjetivos demostrativos"],
         "AI": ["indefinite adjectives", "adjetivos indefinidos"], "A$": ["numeral adjectives", "adjetivos numerales"], "EM": ["adverbs that modify verbs", "adverbios que modifican verbos"],
         "EA": ["adverbs that modify adjectives","adverbios que modifican adjetivos"], "ET": ["adverbs of time", "adverbios de tiempo"], "EP": ["adverbs of place", "adverbios de lugar"],
         "EMM": ["adverbs of manner","adverbios de modo"], "ED": ["adverbs of degree", "adverbios de grado"], "EC": ["adverbs of condition", "adverbios de condición"],
         "ER": ["adverbs of reason", "adverbios de razón"], "CCA": ["coordinating conjunction of addition", "conjunciones copulativas"],
         "CC": ["coordinating conjunctions of contradiction", "conjunciones adversativas"],
         "CO": ["correlative conjunctions", "conjunciones coordinadas"], "CS": ["subordinating conjunctions", "conjunciones subordinadas"], "IS": ["shaded interjections", "interjecciones propias"],
         "II":["introductory interjections", "interjections introductorias"], "IV": ["interjections as sounds", "interjecciones de sonido"], "R": ["prepositions", "preposiciones"],
         "VP": ["physical verbs", "verbos de acciones físicas"], "VM": ["mental verbs", "verbos de acciones mentales"], "VS": ["stative verbs", "verbos de estado"],
         "VT": ["transitive verbs", "verbos transitivos"], "VI": ["intransitive verbs", "verbos intransitivos"], "VA": ["auxiliary verbs", "verbos auxiliares"], "VO": ["modal verbs", "verbo modal"],
         "VH": ["phrasal verb","frase verbal"], "VF": ["indefinite verb", "verbo indefinido"], "VU": ["past tense verb", "verbo en tiempo pasado"], "VG": ["present tense verb","verbo en tiempo presente"],
         "VX": ["future tense verb","verbo en tiempo futuro"], "ID": ["indefinite article", "artículo indefinido"], "DI": ["definite article","artículo definido"],
         "PRDC": ["predicate", "predicado"], "CPS": ["complete subject", "sujeto completo"], "VQ": ["past participle", "participio pasado"], "VR": ["present perfect", "presente perfecto"],
         "VZ": ["present progressive", "presente progresivo"], "VC": ["simple form", "forma simple"],"YA": ["interrogative-mode", "interrogativo-modo"], "YZ": ["interrogative-determiner", "interrogativo-determinante"],
         "XZ1": ["interrogative-subject", "interrogativo-sujeto"], "XZ2":["interrogative-object", "interrogativo-objeto"], "XZ3": ["interrogative of place", "interrogativo de tiempo"],
         "XZ4": ["interrogative of time", "interrogativo de tiempo"], "XZ5": ["interrogative of quantity", "interrogativo de cantidad"], "XZ6": ["interrogative of cause", "interrogativo de causa"],
         "XZ7": ["interrogative of quantity", "interrogativo de cantidad"],"ZS": ["point of time", "desde"], "ZF": ["period of time", "periodo de tiempo"], "VTB": ["'to be' verb", "verbo 'ser' o 'estar'"],
         "VTB1": ["verb to be 1", "verbo ser 1"], "VTB2": ["verb to be 2", "verbo ser 2"], "VTB3" : ["verb to be 3", "verbo ser 3"],"VTB4": ["verb to be 4", "verbo ser 4"],
         "VTB5": ["verb to be 5", "verbo ser 5"], "VTB6": ["verb to be 6", "verbo ser 6"], "VTB7": ["verb to be 7", "verbo ser 7"], "VTBSF": ["'to be' simple future'", "futuro simple 'ser o estar'"],
         "VTH": ["'to have' verb", "verbo 'tener'"], "VTH1": ["verb to have 1", "verbo tener 1"], "VTH2": ["verb to have 2", "verbo tener 2"], "VTH3": ["verb to have 3", "verbo tener 3"],
         "VTH4": ["verb to have 4", "verbo tener 4"], "VTH5": ["verb to have 5", "verbo tener 5"], "VTH6": ["verb to have 6", "verbo tener 6"], "VTH7": ["verb to have 7", "verbo tener 7"],
       },
      'DEFAULT_WORDS': {
        NCA: ['bravery', 'joy'], NCT: ['tree', 'cloud'], NCCC: ['pickpocket', 'water bottle'],
        NCG: ['vixen', 'actress'], NCV: ['a building', 'an attack'], NCGG: ['running fast', 'guessing a number'],
        NCU: ['junk', 'name'], PP: ['he', 'they'], PD: ['this', 'these'],
        PI: ['which', 'who'], PII: ['none', 'several'], PPP: ['his', 'mine'], PR: ['each other', 'one another'],
        PRR: ['which', 'where'], PRP: ['itself', 'himself'], AN: ['yellow', 'large'], APP: ['blue one', 'brave few'],
        AP: ['your', 'our'], AA: ['a', 'an'], AD: ['this', 'these'], AI: ['no', 'many'], A$: ['9', '700'],
        EM: ['carefully', 'gratefully'], EA: ['extremely ashen face'], ET: ['now', 'daily'], EP: ['everywhere', 'in the box'],
        EMM: ['easily', 'like an escaped goat'], ED: ['farthest', 'most cleverly'], EC: ['if it rains', 'unless you apologize'],
        ER: ['like as', 'because'], CCA: ['and', 'or'], CCC: ['and', 'but','or', 'nor', 'yet', 'so', 'for'],
        CO: ['either', 'neither', 'not only', 'but also'],
        CS: ['after', 'although', 'as', 'because', 'before', 'if', 'once', 'since', 'than', 'that', 'though',
        'till', 'until', 'when', 'wheter', 'while'], IS: ['Hey!', 'Oh, that is a surprise'], II: [ 'yes ', 'no', 'indeed', 'well'], IV: ['pheww', 'AHH'],
        R: ['above', 'about', 'across', 'against', ' along', 'among', 'around', 'at', 'before', 'behind', 'below',
        'beneath', 'beside', 'between', ' beyond', 'by', 'down', 'during', 'except', 'for', 'from', ' in', 'inside',
        'into', 'likenear', 'of', 'off', 'on', 'since', ' to', 'toward', 'through', 'under', 'until', ' up', 'upon',
        'with', 'within'], VP: ['sells', 'wrote', 'bought'], VX: ['considered', 'thought'], VS: ['am', 'believe'],
        VT: ['saw the dog', 'ate the pie'], VI: ['the rain fell', 'cat sneezed'], VA: ['are', 'have'],
        VO: ['can', 'could', 'may', 'might', 'must', 'ought to', 'shall', 'should', 'will', 'would'], VH: ['break in'],
        VF: ['I have to smoke'], VU: ['I wanted', 'she kissed me'], VG: ['I walk', 'we sleep'],
        VX: ['Will you marry me', 'He will carry your bag for you'], ID: ['a', 'an'], DI: ['the']
        },
         'VOCABULARY_EN': {
          1:  ['I am', 'you are', 'he is', 'we are', 'they are', 'I was', 'you were', 'he was', 'they were', 'I will be', 'you will be', 'he will be',
          'we will be', 'they will be', 'she has', 'he has', 'it has', 'she had', 'he had', 'it had', 'I have', 'you have', 'we have', 'they have',
          'I had', 'you had', 'we had', 'they had'],
          2: ['this', 'these', 'that', 'those', 'earth', 'beach', 'field', 'safe', 'school', 'soil', 'team', 'weak', 'strong', 'gasoline', 'letter', 'free',
          'brave', 'island', 'instrument', 'brain', 'enemy', 'shy', 'sky', 'eyes', 'nose', 'teeth',
          'cookies', 'milk', 'table', 'mountain',  'lake', 'month', 'center', 'left', 'right', 'correct', 'fruit', 'meat', 'egg', 'day', 'wallet'],
          3: ['think','want','love','like', 'mine', 'yours','his','hers','ours', 'yours', 'their', 'never', 'mother', 'father', 'son', 'daughter', 'brother', 'sister', 'cousin', 'rich', 'hunt', 'smile', 'start', 'nurse', 'dragon', 'holiday', 'bag',
          'sleep', 'night', 'sun', 'moon', 'username', 'paint','brush', 'fight', 'visitor', 'finally', 'totally', 'picture', 'swimming', 'study', 'movie', 'lawn',
          'cry', 'ribs', 'breakfast'],
          4: ['bring', 'broke', 'breaks', 'caught ', 'loves', 'catch', 'eat ', 'ate', 'eating', 'fight', 'fought', 'went ', 'forgot ', 'lost ', 'loses ', 'took ',
          'take', 'steal', 'winning', 'won','writes', 'wrote', 'written', 'rang', 'advice', 'brilliant',
          'confess', 'continent', 'convince', 'united states', 'color', 'me', 'breath', 'french', 'german', 'costa rican', 'american', 'customer',
          'service', 'help', 'newspaper', 'company', 'human', 'garbage', 'tired', 'student', 'second', 'religion', 'math'],
          14: ['ability', 'advice', 'brilliant', 'confess', 'continent', 'convince', 'united states', 'color', 'me', 'breath', 'french', 'german', 'costa rican',
          'american', 'police', 'customer', 'service', 'help', 'newspaper', 'company', 'human', 'garbage', 'tired', 'student', 'second', 'religion', 'math', 'test',
          'ugly', 'sauce', 'sorry', 'good', 'bad', 'uncle', 'score', 'country', 'pool', 'court', 'page', 'shoot', 'seven', 'today', 'tomorrow', 'yesterday', 'weekend',
          'now', 'later', 'basic', 'excellent', 'time', 'folder', 'vacation', 'system', 'restaurant', 'lemonade', 'television', 'bill', 'english', 'spanish', 'problem'],
          5: ['since', 'for', 'years', 'May', 'place', 'weeks', 'yesterday ', 'wife', 'kid', 'teacher', 'president ', 'airplane ', 'boat', 'France', 'trip ', 'swimmer', 'water', 'weekend', 'apartment', 'already', 'arrived', 'called', 'restaurant', 'city', 'husband', 'monsters', 'tickets', 'how', 'what', 'why', 'which', 'who','where',
          'german', 'costa rican', 'police', 'client', 'process','competitor', 'program','policy','pick',
          'compete','research','requirement','sales','same','launch', 'couple', 'opportunity', 'series', 'work',
          'insist','wait','patience','rather','between','pursue','world'],
          6: ['fried eggs', 'scrambled eggs', 'rice with chicken', 'soup', 'to go', 'service', 'sales tax', 'ticket', 'taxi', 'stop here', 'please', 'thank you',
          'fruit smoothie', 'wine', 'coffee', 'plantain', 'salad', 'umbrella', 'fight', 'head', 'horse', 'super market', 'pull',
          'traffic', 'terminal', 'flammable', 'baggage', 'delay', 'push', 'transaction', 'evacuate', 'departures', 'arrivals', 'contamination', 'party',
          'comfortable', 'nearby','reaction','forward','another','generally','building','speak','minute','hour','seconds','because','administration','report','story',
          'truth','saying'],
          7: ['adventure', 'app', 'payment', 'booking', 'computer', 'currency', 'destination', 'event','fee','global','guide','language','season','natural','net rate ',
          'online','passenger','weight','options','code','social media','agent','advisor','zip line','museum','demand','day rate','night rate', 'foreign','guest',
          'hostel','kilometer','menu','promotion','round trip','schedule','spa','tip','value','world', 'cool, nice, awesome', 'pure life', 'dude', 'work', 'fortunately',
          'what a drag', 'take it easy', 'hold on', 'tough luck', 'informal soccer match', 'nice person', 'pay attention', 'go away', 'what a mess', 'thing', 'work',
          'I need', 'rice and beans', 'bus station'],
          8: ['fried eggs', 'scrambled eggs', 'rice with chicken', 'soup', 'to go', 'service', 'sales tax', 'ticket', 'taxi', 'stop here', 'please', 'thank you',
          'fruit smoothie', 'wine', 'coffee', 'plantain', 'salad', 'umbrella', 'fight', 'head', 'horse', 'alcohol', 'hangover', 'super market', 'pull', 'traffic',
          'terminal', 'flammable', 'baggage', 'delay', 'push', 'transaction', 'evacuate', 'departures', 'arrivals', 'contamination', 'party', 'confortable',
          'mechanic', 'teacher', 'veterinarian', 'doctor', 'student', 'farmer', 'chef', 'engineer', 'waitress', 'policeman', 'firefighter', 'lawyer', 'athlete',
          'pilot', 'scientist', 'astronaut', 'artist', 'baker', 'judge'],
        },
        'VOCABULARYT_EN_SP': {
          1: ['yo soy', 'usted es', 'él es', 'nosotros somos', 'ellos son', 'yo fui', 'usted fue', 'él fue', 'ellos fueron', 'yo seré', 'usted será',
          'él será', 'nosotros seremos', 'ellos serán', 'ella tiene', 'el tiene', 'tiene', 'ella tuvo', 'él tuvo', 'tenía', 'yo tengo', 'usted tiene',
          'nosotros tenemos', 'ellos tienen', 'yo tuve', 'ustedes tuvieron', 'nosotros tuvimos', 'ellos tuvieron'],
          2: ['este', 'estos', 'ese', 'esos', 'tierra', 'playa', 'campo', 'seguro', 'escuela', 'suelo', 'equipo', 'débil', 'fuerte', 'gasolina', 'carta', 'gratis', 'valiente',
          'isla', 'instrumento', 'cerebro', 'enemigo', 'tímido', 'cielo', 'ojos', 'nariz', 'diente', 'galleta', 'leche',
          'mesa', 'montaña', 'lago', 'mé', 'centro', 'izquierda', 'derecha', 'correcto', 'fruta', 'carne', 'huevo', 'día', 'billetera'],
          3: ['pensar','querer', 'amar','gustar', 'mío', 'tuyo','de el','de ella','nuestro','de ustedes', 'de ellos/ellas', 'nunca', 'madre', 'padre', 'hijo', 'hija', 'hermano', 'hermana', 'primo', 'rico', 'cazar', 'sonrisa', 'empezar', 'enfermera', 'dragon', 'feriado',
          'bolso', 'dormir', 'noche', 'sol', 'luna', 'usuario', 'pintura', 'pincel', 'pelea', 'visitante', 'finalmente', 'totalmente', 'fotografía', 'nadando',
          'estudiando', 'pelicula', 'jardín', 'llorar', 'costillas', 'desayuno'],
          4:  ['traer', 'quebró', 'quiebra', 'capturó', 'ama', 'capture', 'comer', 'comió', 'come', 'pelea', 'peleo', 'fue ', 'olvido ', 'perdió ',
          'pierde', 'agarro', 'agarre', 'robe', 'ganando', 'ganó','escribe', 'escribió', 'escrito', 'sonó', 'consejo', 'brillante', 'confesar', 'continente', 'convencer', 'Estados Unidos', 'color', 'yo', 'respirar', 'francés', 'alemán', 'costarricense',
          'americano', 'cliente', 'servicio', 'ayuda', 'periódico', 'compañía', 'humano', 'basura', 'cansado', 'estudiante', 'segundo', 'religión', 'matemática'],
          5: ['desde', 'por', 'años', 'marzo', 'lugar', 'semanas', 'ayer', 'esposa', 'niño', 'profesora', 'presidente', 'avión', 'barco', 'Francia', 'viaje',
          'nadador', 'agua', 'fin de semana', 'apartamento', 'ya', 'llegado', 'llamado', 'restaurante', 'ciudad', 'esposo', 'monstruos', 'tiquetes',
          'cómo', 'qué', 'por qué', 'cuál', 'quién', 'dónde','alemán', 'costarricense', 'policía', 'cliente', 'proceso','competidor','programa',
          'regla','escoger','competir','investigar','requisito','venta','igual', 'lanzar', 'par', 'oportunidad', 'serie', 'trabajo','insistir','esperar',
          'paciencia','preferir','entre','seguir','mundo'],
          6: ['Huevos fritos', 'Huevos batidos', 'arroz con pollo', 'sopa', 'para llevar', 'servicio', 'impuesto de venta', 'tiquete', 'taxi', 'pare aquí', 'por favor',
          'gracias', 'batido', 'vino', 'café', 'plátano', 'ensalada', 'paraguas, sombrilla', 'pelea,bronca', 'cabeza,jupa', 'caballo',
          'supermercado,pulpería', 'jalar, jale', 'tránsito, presa', 'terminal', 'inflammable', 'equipaje,maleta', 'tardanza',
          'empujar', 'transacción', 'evacuar', 'salidas', 'llegadas', 'contaminación', 'fiesta, mica', 'cómodo', 'cerca','reacción','adelante','otro',
          'generalmente','edificio','hablar','minuto','hora','segundos','porque','administracion','informe','historia','verdad',
          'diciendo'],
          7: ['aventura', 'aplicación', 'pagó', 'reserva', 'computadora', 'moneda', 'destino', 'evento','cuota','global','guía','lenguaje','temporada','natural',
          'tasa neta', 'en línea','pasajero','peso','opciones','código','red social', 'agente', 'tutor', 'canopy', 'museo', 'demanda', 'tarifa de día',
          'tarifa de noche', 'extranjero', 'huésped', 'hostel', 'kilómetro', 'menú', 'promoción', 'viaje ida y vuelta', 'horario', 'spa', 'valor', 'mundo',
          'lindo, tuanis', 'pura vida', 'mae', 'trabajando, bretear', 'por dicha', 'que pereza, que tigra', 'llevela suave', 'deme un toque', 'mala suerte, salado',
          'mejenga', 'buena nota', 'ponga atención', 'váyase, va jalando', 'qué desastre, qué torta', 'cosa, vara', 'trabajar, bretear', 'necesito,', 'gallo pinto',
          'estación de buses'],
          8: ['Huevos fritos', 'Huevos batidos', 'arroz con pollo', 'sopa', 'para llevar', 'servicio', 'impuesto de venta', 'tiquete', 'taxi', 'pare aquí', 'porfavor',
          'gracias', 'batido', 'vino', 'café', 'plátano', 'ensalada', 'paraguas, sombrilla', 'pelea,bronca', 'cabeza,jupa', 'caballo', 'alcohol',
          'resaca, goma', 'supermercado,pulpería', 'Halar, jale', 'tránsito, presa', 'terminal', 'inflammable', 'equipaje,maleta', 'tardanza', 'empujar', 'transacción',
          'evacuar', 'salidas', 'llegadas', 'contaminación', 'fiesta, mica', 'cómodo', 'mecánico', 'profesor', 'veterinario', 'doctor', 'estudiante', 'granjero',
          'cocinero', 'ingeniero', 'mesero', 'policía', 'bombero', 'abogado', 'atleta', 'piloto', 'scientifico', 'astronauta', 'artista', 'banquero', 'juez'],
        },
        'DEFAULT_TEXTS': {
          1: ["<text><sentence id='0'><complete-subject>Fernando</complete-subject><predicate>is a student.</predicate><verb-to-be>is</verb-to-be></sentence>"  +
          "<sentence id='1'><complete-subject>He</complete-subject><predicate>is from Costa Rica.</predicate><verb-to-be>is</verb-to-be></sentence>" +
          "<sentence id='2'><complete-subject>Fernando</complete-subject><predicate>is an athlete.</predicate><verb-to-be>is</verb-to-be></sentence>" +
          "<sentence id='3'><complete-subject>He</complete-subject><predicate>is a swimmer.</predicate><verb-to-be>is</verb-to-be></sentence></text>",
          "<text><sentence id='0'><complete-subject>Keylor Navas</complete-subject><predicate>is a goalkeeper.</predicate><verb-to-be>is</verb-to-be></sentence>" +
          "<sentence id='1'><complete-subject>Keylor Navas</complete-subject><predicate>is Costa Rican.</predicate><verb-to-be>is</verb-to-be></sentence>" +
          "<sentence id='2'><complete-subject>Keylor Navas</complete-subject><predicate>is a good soccer player.</predicate><verb-to-be>is</verb-to-be></sentence>" +
          "<sentence id='3'><complete-subject>He</complete-subject><predicate>is the best.</predicate><verb-to-be>is</verb-to-be></sentence></text>",
          "<text id='1'><sentence id='0'><complete-subject>Computers</complete-subject><predicate>are machines.</predicate><verb-to-be>are</verb-to-be></sentence>" +
          "<sentence id='1'><complete-subject>Computers</complete-subject><predicate>are great.</predicate><verb-to-be>are</verb-to-be></sentence>" +
          "<sentence id='2'><complete-subject>They</complete-subject><predicate>are excellent for work.</predicate><verb-to-be>are</verb-to-be></sentence>" +
          "<sentence id='3'><complete-subject>Computers</complete-subject><predicate>are easy to use.</predicate><verb-to-be>are</verb-to-be></sentence></text>",
          "<text id='1'><sentence id='0'><complete-subject>Alessandro and Jorge</complete-subject><predicate>have a soccer match.</predicate><verb-to-have>have</verb-to-have></sentence>" +
          "<sentence id='1'><complete-subject>They</complete-subject><predicate>have great skills.</predicate><verb-to-have>have</verb-to-have></sentence>" +
          "<sentence id='2'><complete-subject>They</complete-subject><predicate>have to get ready.</predicate><verb-to-have>have</verb-to-have></sentence>" +
          "<sentence id='3'><complete-subject>Both</complete-subject><predicate>have a match to win.</predicate><verb-to-have>have</verb-to-have></sentence></text>",
          "<text id='1'><sentence id='0'><complete-subject>Mariana</complete-subject><predicate>has a computer.</predicate><verb-to-have>has</verb-to-have></sentence>" +
          "<sentence id='1'><complete-subject>She</complete-subject><predicate>has great taste in food.</predicate><verb-to-have>has</verb-to-have></sentence>" +
          "<sentence id='2'><complete-subject>Mariana</complete-subject><predicate>has a dog.</predicate><verb-to-have>has</verb-to-have></sentence>" +
          "<sentence id='3'><complete-subject>The dog</complete-subject><predicate>has white hair.</predicate><verb-to-have>has</verb-to-have></sentence></text>",
          ],
          2: ["<text id='1'>" +
          "<sentence id='0'><complete-subject>This earing</complete-subject><predicate>is made of gold.</predicate><verb-to-be id='VTB7'>is</verb-to-be><pronoun id='PD1'>This</pronoun></sentence>" +
          "<sentence id='1'><complete-subject>These earrings</complete-subject><predicate>are made of silver.</predicate><verb-to-be>are</verb-to-be><pronoun id='PD3'>These</pronoun></sentence>" +
          "<sentence id='2'><complete-subject>This earring</complete-subject><predicate>{will be} sold.</predicate><verb-to-be>will be</verb-to-be><pronoun id='PD1'>This</pronoun></sentence>" +
          "</text>",
          "<text id='1'>" +
          "<sentence id='0'><complete-subject>Those</complete-subject><predicate>are her emails.</predicate><verb-to-be>are</verb-to-be><pronoun id='PD4'>Those</pronoun></sentence>" +
          "<sentence id='1'><complete-subject>That</complete-subject><predicate>is her computer.</predicate><verb-to-be>is</verb-to-be><pronoun id='PD2'>That</pronoun></sentence>" +
          "</text>",
          "<text>" +
          "<sentence id='0'><complete-subject>I</complete-subject><predicate>am going to play basketball later.</predicate><pronoun id='PP1'>I</pronoun></sentence>" +
          "<sentence id='1'><complete-subject>Would you</complete-subject><predicate>like to join me?</predicate><pronoun id='PP2'>you</pronoun></sentence>" +
          "<sentence id='2'><complete-subject>Those books</complete-subject><predicate>can wait for later.</predicate><pronoun  id='PD4'>those</pronoun></sentence>" +
          "</text>"
          ],
          3: ["<text>" +
          "<sentence id='0'><complete-subject>I</complete-subject><predicate>love the beach.</predicate><verb id='VG'>love</verb><present id='VG'>love</present><simple-past id='VU'>loved</simple-past><past-participle id='VQ'>loved</past-participle><present-perfect id='VR'>have loved</present-perfect><future id='VX'>will love</future><pronoun id='PP'>I</pronoun></sentence>" +
          "<sentence id='1'><complete-subject>You</complete-subject><predicate>love the beach.</predicate><verb id='VG'>love</verb><present id='VG'>love</present><simple-past id='VU'>loved</simple-past><past-participle id='VQ'>loved</past-participle><present-perfect id='VR'>have loved</present-perfect><future id='VX'>will love</future><pronoun id='PP'>You</pronoun></sentence>" +
          "<sentence id='2'><complete-subject>We</complete-subject><predicate>love the beach.</predicate><verb id='VG'>love</verb><present id='VG'>love</present><simple-past id='VU'>loved</simple-past><past-participle id='VQ'>loved</past-participle><present-perfect id='VR'>have loved</present-perfect><future id='VX'>will love</future><pronoun id='PP'>we</pronoun></sentence>" +
          "<sentence id='3'><complete-subject>They</complete-subject><predicate>love the beach.</predicate><verb id='VG'>love</verb><present id='VG'>love</present><simple-past id='VU'>loved</simple-past><past-participle id='VQ'>loved</past-participle><present-perfect id='VR'>have loved</present-perfect><future id='VX'>will love</future><pronoun id='PP'>they</pronoun></sentence>" +
          "</text>"
          ],
          4: ["<text>" +
          "<sentence id='0'><complete-subject>All the students</complete-subject><predicate>eat their lunch in the cafeteria.</predicate><verb id='VG'>eat</verb><present id='VG'>eat</present><simple-form id='VC'>eat</simple-form><simple-past id='VU'>ate</simple-past><past-participle id='VQ'>eaten</past-participle><future id='VX'>will catch</future></sentence>" +
          "<sentence id='1'><complete-subject>Yesterday they</complete-subject><predicate>ate In the central plaza.</predicate><verb id='VC'>ate</verb><present id='VG'>eat</present><simple-form id='VC'>eat</simple-form><simple-past id='VU'>ate</simple-past><past-participle id='VQ'>eaten</past-participle><future id='VX'>will eat</future></sentence>" +
          "<sentence id='2'><complete-subject>Today they</complete-subject><predicate>have eaten eating meat.</predicate><verb id='VQ'>eaten</verb><present id='VG'>eat</present><simple-form id='VC'>eat</simple-form><simple-past id='VU'>ate</simple-past><past-participle id='VQ'>eaten</past-participle><future id='VX'>will eat</future></sentence>" +
          "</text>"
          ],
          5: ["<text>" +
          "<sentence id='0'><complete-subject id='inPredicate'>your apartment</complete-subject><predicate>How big is your apartment?</predicate><interrogative>How</interrogative><verb id='VG'>is</verb><present id='VG'>is</present><simple-past id='VU'>was</simple-past><past-participle id='VQ'>been</past-participle><present-perfect id='VQ'>has been</present-perfect><future id='VX'>will be</future></sentence>" +
          "<sentence id='1'><complete-subject id='inPredicate'>you</complete-subject><predicate>What do you like in a house?</predicate><interrogative>what</interrogative><verb id='VG'>like</verb><present id='VG'>like</present><simple-past id='VU'>have liked</simple-past><past-participle id='VQ'>liked</past-participle><present-perfect id='VR'>have liked</present-perfect><future id='VX'>will like</future></sentence>" +
          "</text>",
          "<text>" +
          "<sentence id='0'><complete-subject id='inPredicate'>you</complete-subject><predicate>How did you get here?</predicate><interrogative>How</interrogative><verb id='VG'>get</verb><present id='VG'>get</present><simple-past id='VU'>got</simple-past><past-participle id='VQ'>gotten</past-participle><present-perfect id='VR'>have got</present-perfect><future id='VX'>will get</future><pronoun id='PP'>you</pronoun></sentence>" +
          "<sentence id='1'><complete-subject>I</complete-subject><predicate>drove my car.</predicate><verb id='VU'>drove</verb><present id='VG'>drive</present><simple-past id='VU'>drove</simple-past><past-participle id='VQ'>driven</past-participle><present-perfect id='VR'>have driven</present-perfect><future id='VX'>will drive</future><pronoun id='PP'>I</pronoun><pronoun id='PPP'>my</pronoun></sentence>" +
          "<sentence id='2'><complete-subject id='inPredicate'>your car</complete-subject><predicate>What color is your car?</predicate><interrogative>what</interrogative><verb id='VG'>is</verb><present id='VG'>is</present><simple-past id='VU'>was</simple-past><past-participle id='VQ'>been</past-participle><present-perfect id='VR'>has been</present-perfect><future id='VX'>will be</future><pronoun id='PPP'>your</pronoun></sentence>" +
          "<sentence id='3'><complete-subject>My car</complete-subject><predicate>is blue</predicate><verb id='VG'>is</verb><present id='VG'>is</present><simple-past id='VU'>was</simple-past><past-participle id='VQ'>been</past-participle><present-perfect id='VR'>has been</present-perfect><future id='VX'>will be</future><pronoun id='PPP'>my</pronoun></sentence>" +
          "</text>",
          "<text>" +
          "<sentence id='0'><complete-subject>Amy</complete-subject><predicate>has been here for two weeks.</predicate><verb id='VQ'>has been</verb><present id='VG'>is</present><simple-past id='VU'>was</simple-past><past-participle id='VQ'>been</past-participle><present-perfect id='VR'>am</present-perfect><future id='VX'>will be</future></sentence>" +
          "<sentence id='1'><complete-subject>Sebastian</complete-subject><predicate>has been here since September.</predicate><verb id='VQ'>has been</verb><present id='VG'>is</present><simple-past id='VU'>was</simple-past><past-participle id='VQ'>been</past-participle><present-perfect id='VR'>am</present-perfect><future id='VX'>will be</future></sentence>" +
          "<sentence id='0'><complete-subject>Fernando</complete-subject><predicate>has been here since yesterday.</predicate><verb id='VQ'>has been</verb><present id='VG'>is</present><simple-past id='VU'>was</simple-past><past-participle id='VQ'>been</past-participle><present-perfect id='VR'>am</present-perfect><future id='VX'>will be</future></sentence>" +
          "<sentence id='3'><complete-subject>Robert</complete-subject><predicate>has been here since the term started.</predicate><verb id='VQ'>has been</verb><present id='VG'>is</present><simple-past id='VU'>was</simple-past><past-participle id='VQ'>been</past-participle><present-perfect id='VR'>am</present-perfect><future id='VX'>will be</future></sentence>" +
          "<sentence id='0'><complete-subject>His</complete-subject><predicate>wife has been here for a couple of hours.</predicate><verb id='VQ'>has been</verb><present id='VG'>is</present><simple-past id='VU'>was</simple-past><past-participle id='VQ'>been</past-participle><present-perfect id='VR'>am</present-perfect><future id='VX'>will be</future></sentence>" +
          "<sentence id='3'><complete-subject>Their</complete-subject><predicate>friends have been here for fifteen minutes.</predicate><verb id='VQ'>have been</verb><present id='VG'>is</present><simple-past id='VU'>was</simple-past><past-participle id='VQ'>been</past-participle><present-perfect id='VR'>am</present-perfect><future id='VX'>will be</future></sentence>" +
          "</text>",
          ],
          6: ["<text id='6'>" +
          "<sentence id='0'><complete-subject>Everybody^P</complete-subject><predicate>knows^V Wanchope.^N</predicate></sentence>" +
          "<sentence id='1'><complete-subject>He^NP</complete-subject><predicate>was^V born^A in^R Heredia^N in^R 1976.^A$</predicate></sentence>" +
          "<sentence id='2'><complete-subject>He^NP</complete-subject><predicate>is^V 1.93m^A$ tall^AN and^CC weights^AN {78 kg.}^A$</predicate></sentence>" +
          "<sentence id='3'><complete-subject>Today^E he^P</complete-subject><predicate>is^V one^A of^R the^DI most^A outstanding^A soccer^N players^N,NC in^R the^A,AA world.^N,NC.</predicate></sentence>" +
          "<sentence id='4'><complete-subject>In^R December^N,NP 2000,^A$</complete-subject><predicate>he^P,PP rose^V,VP,VU to^R become^V,VI,VG the^A,AA 22nd^A$player^N,NC in^R FIFA.^N,NP</predicate></sentence>" +
          "<sentence id='5'><complete-subject>He^PP</complete-subject><predicate>left^A,AN Heredia's^N,NP Team^N,NCC in^R 1997^A$ and^R became^V,VI a^ID player^N,NC for^R {Derby County.}^N,NP.</predicate></sentence>" +
          "<sentence id='6'><complete-subject>In^R 1999,^A$ he^PP</complete-subject><predicate>left^A,AN for^R {WestHam United.}^N,NP</predicate></sentence>" +
          "<sentence id='7'><complete-subject>In^R March^N,NP 2002,^A$ playing^N,NCV for^R Manchester,^N,NP he^PP</complete-subject><predicate>suffered^V,VT,VU a^AA,A knee^N,NC injury.^NCV,N</predicate></sentence>" +
          "<sentence id='8'><complete-subject>In^R July,^N,NP still^A,APP fighting^V,VT,VG to^R save^V,VT,VG his^A,AP career,^N,NC he^P,PP</complete-subject><predicate>underwent^V,VT,VU surgery^N,NC for^R the^DI same^A knee^N,NC problem.^N,NCA</predicate></sentence>" +
          "<sentence id='9'><complete-subject>In^R 2003,^A,A$ he^P,PP</complete-subject><predicate>went^V,VT,VU to^R surgery^N,NC again^E,EM for^R a^ID hip^N,NC problem,^N,NCA and^R suffered^V,VU,VP from^R a^ID dislocated^A,AN shoulder^N,NC while^C,CS training.^N,NCV</predicate></sentence>" +
          "</text>",
          "<text id='6'>" +
          "<sentence id='0'><complete-subject>{Costa Rica's}^NP topography^NC provides^VI</complete-subject><predicate>excellent^AN water^NC all^AN year^NC long.^AN</predicate></sentence>" +
          "<sentence id='1'><complete-subject>{Costa Sol Rafting}^NP</complete-subject><predicate>runs^VI,VP,VG tours^NC of^R class^NC 2^A# and^R of^R class^NC 4^A# like^AD the^DI Reventazon^NP and^AA Pacuare,^NP and^c offers^VT,VG,VP the^AA highest^AN quality^NC trips^NC available.^AN</predicate></sentence>" +
          "<sentence id='2'><complete-subject>All^AN tours^NC include:^VT,VG</complete-subject><predicate>lunch,^NC insurance,^NC transportation,^NCsecurity kayak,^NCCCtypical breakfast,^NCCC {rafting equipment,}^NCCC trained^VT,VG guides^NC in^R {cardiopulmonary resuscitation}^CPR,NCCC and^C {First Aid.}^NCCC</predicate></sentence>" +
          "<sentence id='3'><complete-subject>You^NP</complete-subject><predicate>have^VU to^R be^VX ready^AN to^R get^VT,VX wet!^AN.</predicate></sentence>" +
          "<sentence id='4'><complete-subject>During^R the^DI rafting^NCV trip^NC you^PP</complete-subject><predicate>should^VO,VX wear^NCV sneakers^NC or^C {river shoes,}^NCCC shorts^NC and^C a^AA T-shirt.^NC</predicate></sentence>" +
          "</text>"
          ],
        // 7: [2],
        // 8: [2],
        // 9: [2],
      }
    });
})();
