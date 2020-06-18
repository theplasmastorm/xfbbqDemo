 
;  SYNERGY DATA LANGUAGE OUTPUT
;
;  REPOSITORY     : C:\Users\devadm\Desktop\xfbbq\xfBBQHarmonyCore\Repository\bi
;                 : C:\Users\devadm\Desktop\xfbbq\xfBBQHarmonyCore\Repository\bi
;                 : Version 11.1.1c
;
;  GENERATED      : 16-JUN-2020, 11:51:19
;                 : Version 11.1.1b
;  EXPORT OPTIONS : [ALL] 
 
 
Enumeration DONENESSTYPE
   Description "Temperature of burger meat"
   Members RARE 1, MEDRARE 2, MED 3, MEDWELL 4, WELLDONE 5, SPECIAL 6
 
Enumeration MEATTYPE
   Description "Type of burger meat"
   Members BEEF 1, TURKEY 2, VEGETARIAN 3, SPECIAL 4
 
Enumeration TYPETYPE
   Description "Hotdog type"
   Members NORMAL 1, HOTLINK 2, SAUSAGE 3, SPECIAL 4
 
Enumeration USERTYPE
   Description "Type of user"
   Members ADMINISTRATOR 1, HOST 2, ATTENDEE 3
 
Structure BBQ   DBL ISAM
   Description "BBQ Table"
   Long Description
      "NO_DELETE_ENDPOINT"
 
Field ID   Type DECIMAL   Size 8
   Description "ID of BBQ"
 
Field CREATIONDATE   Type DECIMAL   Size 10
   Description "Timestamp of when BBQ was created"
 
Field HELDDATE   Type DECIMAL   Size 10
   Description "Timestamp of when BBQ is going tobe held"
 
Key ID   ACCESS   Order ASCENDING   Dups NO
   Description "ID of BBQ"
   Segment FIELD   ID  SegType DECIMAL  SegOrder ASCENDING
 
Relation  1   BBQ ID   ORDER BBQID
 
Structure FAVORITE   DBL ISAM
   Description "Favorites Table"
   Long Description
      "NO_POST_ENDPOINT"
 
Field ID   Type DECIMAL   Size 8
   Description "ID of favorite"
 
Field MEAT   Type DECIMAL   Size 1
   Description "What burger meat"
 
Field CHEESE   Type DECIMAL   Size 1
   Description "Amount of cheese slices"
 
Field DONENESS   Type DECIMAL   Size 1
   Description "Temperature of burger meat"
 
Field SPICY   Type DECIMAL   Size 1
   Description "Pungency of burger"
 
Field TYPE   Type DECIMAL   Size 1
   Description "Hotdog type"
 
Field COUNT   Type DECIMAL   Size 1
   Description "Amount of hotdogs"
 
Field BURNT   Type DECIMAL   Size 1
   Description "Whehter the hotdog is to be burnt or not"
 
Field USERID   Type DECIMAL   Size 8
   Description "ID of user who favored"
 
Key ID   ACCESS   Order ASCENDING   Dups NO
   Description "ID of favorite"
   Segment FIELD   ID  SegType DECIMAL  SegOrder ASCENDING
 
Key USERID   ACCESS   Order ASCENDING   Dups YES
   Description "ID of user who favored"
   Segment FIELD   USERID
 
Relation  1   FAVORITE USERID   USER ID
 
Structure ORDER   DBL ISAM
   Description "Order Table"
   Long Description
      "NO_POST_ENDPOINT"
 
Field ID   Type DECIMAL   Size 8
   Description "ID of order"
 
Field MEAT   Type DECIMAL   Size 1
   Description "What burger meat"
 
Field CHEESE   Type DECIMAL   Size 1
   Description "Amount of cheese slices"
 
Field DONENESS   Type DECIMAL   Size 1
   Description "Temperature of burger meat"
 
Field SPICY   Type DECIMAL   Size 1
   Description "Pungency of burger"
 
Field TYPE   Type DECIMAL   Size 1
   Description "Hotdog type"
 
Field COUNT   Type DECIMAL   Size 1
   Description "Amount of hotdogs"
 
Field BURNT   Type DECIMAL   Size 1
   Description "Whehter the hotdog is to be burnt or not"
 
Field ORDERDATE   Type DECIMAL   Size 10
   Description "Timestamp of order creation"
 
Field USERID   Type DECIMAL   Size 8
   Description "ID of user who ordered"
 
Field BBQID   Type DECIMAL   Size 8
   Description "ID of BBQ this order pertains to"
 
Key ID   ACCESS   Order ASCENDING   Dups NO
   Description "ID of order"
   Segment FIELD   ID  SegType DECIMAL  SegOrder ASCENDING
 
Key USERID   ACCESS   Order ASCENDING   Dups YES
   Description "ID of user who ordered"
   Segment FIELD   USERID
 
Key BBQID   ACCESS   Order ASCENDING   Dups YES
   Description "ID of BBQ this order pertains to"
   Segment FIELD   BBQID
 
Relation  1   ORDER USERID   USER ID
 
Relation  2   ORDER BBQID   BBQ ID
 
Structure SYSPARAMS   RELATIVE
   Description "System parameter file"
 
Field PARAM_NAME   Type ALPHA   Size 30
   Description "Parameter name"
 
Field PARAM_VALUE   Type DECIMAL   Size 6
   Description "Parameter value"
 
Key RECORD_NUMBER   ACCESS   Order ASCENDING   Dups NO
   Segment RECORD NUMBER
 
Structure USER   DBL ISAM
   Description "User table"
   Long Description
      "NO_POST_ENDPOINT"
      "NO_DELETE_ENDPOINT"
 
Field ID   Type DECIMAL   Size 8
   Description "ID of user"
   Required
 
Field JOINDATE   Type DECIMAL   Size 10
   Description "Timestamp of when the user joined"
   Readonly
   Nonull
 
Field TYPE   Type DECIMAL   Size 1
   Description "Type of user"
 
Field EMAIL   Type ALPHA   Size 100
   Description "Email of user"
 
Field LASTLOGINDATE   Type DECIMAL   Size 10
   Description "Timestamp of when the user last loggedin"
 
Field HASH   Type ALPHA   Size 100
   Description "Hashed password of user"
 
Field NAME   Type ALPHA   Size 100
   Description "Name of user"
 
Field RECOVERYCODE   Type ALPHA   Size 100
   Description "Recovery code of user"
 
Key ID   ACCESS   Order ASCENDING   Dups NO
   Description "User ID"
   Segment FIELD   ID  SegType DECIMAL  SegOrder ASCENDING
 
Relation  1   USER ID   FAVORITE USERID
 
Relation  2   USER ID   ORDER USERID
 
File BBQ   DBL ISAM   "DAT:BBQ.ism"
   Description "BBQ File"
   Assign BBQ
 
File FAVORITE   DBL ISAM   "DAT:FAVORITE.ism"
   Description "Favorite File"
   Assign FAVORITE
 
File ORDER   DBL ISAM   "DAT:Order.ism"
   Description "Order File"
   Assign ORDER
 
File SYSPARAMS   RELATIVE   "DAT:sysparams.ddf"
   Description "System parameter file"
   Assign SYSPARAMS
 
File USER   DBL ISAM   "DAT:User.ism"
   Description "User File"
   Assign USER
 
