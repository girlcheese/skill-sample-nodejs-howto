'use strict'

var Alexa = require('alexa-sdk')
var APP_ID = 'amzn1.ask.skill.1c343c6f-9c2b-4867-be1a-e929c8e41ad4' // OPTIONAL: replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';
var SKILL_NAME = 'Bicycle Helper'
var recipes = require('./recipes')

exports.handler = function (event, context, callback) {
  var alexa = Alexa.handler(event, context)
  alexa.appId = APP_ID
  alexa.registerHandlers(handlers)
  alexa.execute()
}

var handlers = {
  // Use LaunchRequest, instead of NewSession if you want to use the one-shot model
  // Alexa, ask [my-skill-invocation-name] to (do something)...
  'NewSession': function () {
    this.attributes[ 'speechOutput' ] = 'Welcome to ' + SKILL_NAME + '. You can ask a question like, what is ' +
      'a headset? ... Now, what can I help you with.'
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    this.attributes[ 'repromptSpeech' ] = 'For instructions on what you can say, please say help me.'
    this.emit(':ask', this.attributes[ 'speechOutput' ], this.attributes[ 'repromptSpeech' ])
  },
  'DefinitionIntent': function () {
    var itemSlot = this.event.request.intent.slots.Item
    var itemName
    if (itemSlot && itemSlot.value) {
      itemName = itemSlot.value.toLowerCase()
    }

    var cardTitle = SKILL_NAME + ' - Definition of: ' + itemName
    var recipe = recipes[ itemName ]

    if (recipe) {
      this.attributes[ 'speechOutput' ] = recipe
      this.attributes[ 'repromptSpeech' ] = 'Try saying repeat.'
      this.emit(':askWithCard', recipe, this.attributes[ 'repromptSpeech' ], cardTitle, recipe)
    } else {
      var speechOutput = 'I\'m sorry, I currently do not know '
      var repromptSpeech = 'What else can I help with?'
      if (itemName) {
        speechOutput += 'the definition of ' + itemName + '. '
      } else {
        speechOutput += 'that definition. '
      }
      speechOutput += repromptSpeech

      this.attributes['speechOutput'] = speechOutput
      this.attributes['repromptSpeech'] = repromptSpeech

      this.emit(':ask', speechOutput, repromptSpeech)
    }
  },
  'AMAZON.HelpIntent': function () {
    this.attributes[ 'speechOutput' ] = 'You can ask questions such as, what\'s the definition, or, you can say exit... ' +
      'Now, what can I help you with?'
    this.attributes[ 'repromptSpeech' ] = 'You can say things like, what is, or you can say exit...' +
      ' Now, what can I help you with?'
    this.emit(':ask', this.attributes[ 'speechOutput' ], this.attributes[ 'repromptSpeech' ])
  },
  'AMAZON.RepeatIntent': function () {
    this.emit(':ask', this.attributes[ 'speechOutput' ], this.attributes[ 'repromptSpeech' ])
  },
  'AMAZON.StopIntent': function () {
    this.emit('SessionEndedRequest')
  },
  'AMAZON.CancelIntent': function () {
    this.emit('SessionEndedRequest')
  },
  'SessionEndedRequest': function () {
    this.emit(':tell', 'Goodbye!')
  }
}
