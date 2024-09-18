## CERTIFICATES

openssl s_client -connect hostname:port -showcerts -starttls ftp

move .crt to /usr/local/share/ca-certificates/

sudo update-ca-certificates

certs are in /etc/ssl/certs


