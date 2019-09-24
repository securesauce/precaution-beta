# Copyright 2019 VMware, Inc.
# SPDX-License-Identifier: BSD-2-Clause

FROM photon:3.0

# Install the needed programming languages and tools
RUN tdnf update -y && tdnf install -y \
    go \
    python3 \
    python3-pip \
    python3-setuptools \
    nodejs \
    git

# Copy precaution in the root directory
COPY . precaution

# Setup a work directory for all comamnds below
WORKDIR ./precaution

# Install all Python dependencies
RUN pip3 install --upgrade pip && pip3 install -r requirements.txt

# Install all JavaScript and TypeScript dependencies
RUN npm install

# Download the tar.gz gosec file version 2.0.0
RUN curl -OL https://github.com/securego/gosec/releases/download/2.0.0/gosec_2.0.0_linux_amd64.tar.gz

# We need sha256sum which is not installed by default in toybox but it's available in util-linux.
# There is a conflict between toybox and util-linux and that's why we have to remove toybox.
RUN tdnf remove toybox -y && tdnf install util-linux -y

# Validate Gosec tar.gz file checksum
RUN echo "490c2a0434b2b9cbb2f4c5031eafe228023f1ac41b36dddd757bff9e1de76a2b  ./gosec_2.0.0_linux_amd64.tar.gz" | sha256sum -c -

# Install all necessary tools to unzip the gosec tar.gz file
RUN tdnf install -y \
    tar \
    gzip

# Unzip and remove the redundant tar.gz file
RUN tar -xvzf gosec_2.0.0_linux_amd64.tar.gz -C /usr/bin && rm ./gosec_2.0.0_linux_amd64.tar.gz

# Cleanup of the already unnecessary installed packages
RUN tdnf remove -y \
    python3-pip \
    python3-setuptools \
    git \
    util-linux \
    tar \
    gzip

# Start application on port given by Heroku
CMD npm start -- --port $PORT
