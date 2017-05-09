'use strict';
polarity.export = PolarityComponent.extend({
    computedTest: Ember.computed('block.data.details', function(){
        let test =  Ember.Object.create({
            type: 'NA'
        });
        return 'test data 2';
    })
});

