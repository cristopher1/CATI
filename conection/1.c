#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <dirent.h>

int main(int argc, char **argv){
	DIR *dp;
	struct dirent * ep;

	if(argv[1] == NULL){
		dp = opendir(".");
		while (ep = readdir(dp)){
			char *buf = ep->d_name;
			if(!strcmp(buf,".") | !strcmp(buf,"..")){
				continue;	
			}
			printf("%s \n", buf);
		}
		closedir(dp);
		return 1;
	}

	if(argv[1]!=NULL){
	    dp = opendir(argv[1]);
		while (ep = readdir(dp)){
			char *buf = ep->d_name;
			if(!strcmp(buf,".") | !strcmp(buf,"..")){
				continue;	
			}
			printf("%s \n", buf);
			closedir(dp);
		}
		return 1;
	}

	return 0;
}
