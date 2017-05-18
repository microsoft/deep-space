FROM tomcat:8.0.20-jre8
ADD DeepSpace/target/deepspace.war /usr/local/tomcat/webapps/deepspace.war
