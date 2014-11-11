'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * League Schema
 */
var LeagueSchema = new Schema({
    _id: {
        type: String,
        trim: false,
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    groups: [
        {
            _id: {
                type: String,
                trim: false,
                required: true
            },
            name: {
                type: String,
                trim: true,
                required: true
            },
            matches: [
                {
                    date: {
                        type: Date,
                        default: new Date()
                    },
                    hometeam: {
                        type: String,
                        default: '',
                        trim: true
                    },
                    awayteam: {
                        type: String,
                        default: '',
                        trim: true
                    },
                    homegoals: {
                        type: Number,
                        default: null
                    },  
                    awaygoals: {
                        type: Number,
                        default: null
                    },  
                }
            ],
            teams: [
                {
                    _id: {
                        type: String,
                        trim: false,
                        required: true
                    },
                    name: {
                        type: String,
                        trim: true,
                        required: true
                    },
                    gamesplayed: {
                        type: Number,
                        default: 0
                    },
                    wins: {
                        type: Number,
                        default: 0
                    },
                    ties: {
                        type: Number,
                        default: 0
                    },
                    losses: {
                        type: Number,
                        default: 0
                    },
                    goalsscored: {
                        type: Number,
                        default: 0
                    },
                    goalsagainst: {
                        type: Number,
                        default: 0
                    },
                    goaldiff: {
                        type: Number,
                        default: 0
                    },
                    points: {
                        type: Number,
                        default: 0
                    },
                    players: [
                        {
                            name: {
                                type: String,
                                default: '',
                                trim: true
                            },
                            age: {
                                type: Number,
                                default: 0
                            },
                            goalsscored: {
                                type: Number,
                                default: 0
                            }
                        }
                    ]
                }
            ]
        }
    ],
    playoffs: {
        quarterfinals: [
            {
                date: {
                    type: Date,
                    default: new Date()
                },
                hometeam: {
                    type: String,
                    default: '',
                    trim: true
                },
                awayteam: {
                    type: String,
                    default: '',
                    trim: true
                },
                homegoals: {
                    type: Number,
                    default: null
                },  
                awaygoals: {
                    type: Number,
                    default: null
                },  
            }
        ],
        semifinals: [
            {
                date: {
                    type: Date,
                    default: new Date()
                },
                hometeam: {
                    type: String,
                    default: '',
                    trim: true
                },
                awayteam: {
                    type: String,
                    default: '',
                    trim: true
                },
                homegoals: {
                    type: Number,
                    default: null
                },  
                awaygoals: {
                    type: Number,
                    default: null
                },  
            }
        ],
        leaguefinal: [
            {
                date: {
                    type: Date,
                    default: new Date()
                },
                hometeam: {
                    type: String,
                    default: '',
                    trim: true
                },
                awayteam: {
                    type: String,
                    default: '',
                    trim: true
                },
                homegoals: {
                    type: Number,
                    default: null
                },  
                awaygoals: {
                    type: Number,
                    default: null
                },  
            }
        ]
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Validations
 */
LeagueSchema.path('name').validate(function(name) {
    return name.length;
}, 'Name cannot be blank');

/**
 * Statics
 */
LeagueSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('League', LeagueSchema);