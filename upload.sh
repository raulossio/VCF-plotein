echo 'Deleting static plotein from server'
ssh root@10.200.0.44 'rm -r /var/www/html/*'

echo 'Uploading static plotein to server'
scp -r dist/* root@10.200.0.44:/var/www/html
