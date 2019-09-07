#!/usr/bin/perl

use File::Basename;
use JSON 'decode_json';

chdir dirname($0);
my $basename = basename($0);

`mkdir -p tmp`;

local $| = 1;
while(<STDIN>) {
  chomp;
  my $values = decode_json($_);
  my $message = $values->{text};

  open(F, '>> tmp/log.txt');
  print F "$basename received .text: $message\n";
  close(F);
  print STDOUT "\n";
}

# print STDERR "exit $0\n";