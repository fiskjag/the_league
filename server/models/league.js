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
                        default: '2014-01-01'
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
                        default: 0
                    },  
                    awaygoals: {
                        type: Number,
                        default: 0
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
                    points: {
                        type: Number,
                        default: 0
                    },
                    players: [
                        {
                            _id: {
                                type: String,
                                trim: false,
                                required: true
                            },
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