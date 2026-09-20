package com.fashion.enums;

public enum Role {
   ADMIN,
    STAFF,
    CUSTOMER;

   public static Role fromString(String roleStr){
       for(Role r : Role.values()){
           if(r.name().equalsIgnoreCase(roleStr)){
               return r;
           }
       }
       return CUSTOMER;
   }
}
