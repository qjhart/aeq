#! /bin/make
SHELL:=/bin/bash

cmd:=aeq
prefix:=$(shell echo ~/.local)


pre-commit: README.pod
	@podchecker ${cmd}

README.pod: ${cmd}
	@podselect $< > $@

install:
	@type podchecker;
	@type http;
	@type pod2text;
	@if [[ -d ${prefix}/bin ]]; then\
    echo "install ${cmd} ${prefix}/bin"; \
    install ${cmd} ${prefix}/bin; \
	else \
		echo "installation directory ${prefix}/bin not found"; \
		echo "Try setting prefix as in make prefix=/usr/local install"; \
		exit 1; \
	fi;
