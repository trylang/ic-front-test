#! /bin/bash
#server='ark@192.168.1.203'
#path='/ps_new/ark/service/www/ic'
#password='ark2016'

# 临港生产环境部署
server='ark@101.132.188.149'
path='/ps_data/ark/service/www/ic'
password='ic@2017'

ssh $server "cd $path && rm -rf *"
#sshpass -p $password 
scp -Cr ./dist/** $server:$path
