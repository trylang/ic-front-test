#! /bin/bash
server='ark@192.168.1.204'
path='/ps_new/ark/service/www/ic'
password='ark2016'

sshpass -p $password ssh $server "cd $path && rm -rf *"
#sshpass -p $password 
#scp -Cr ./dist/** $server:$path

sshpass -p $password rsync -avz ./dist/ $server:$path
