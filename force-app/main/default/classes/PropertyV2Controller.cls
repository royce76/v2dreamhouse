public with sharing class PropertyV2Controller {
    @AuraEnabled(cacheable=true)
    public static List<Property__c> getPropertyV2List() {
        return [ 
            SELECT Id, Name, Beds__c, Baths__c, City__c, Price__c, Thumbnail__c
            FROM Property__c 
            WITH SECURITY_ENFORCED 
        ];
    }
}
