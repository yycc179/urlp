# coding=utf-8
import re
import cgi
import sys
import os
import urllib2
import errno
import json


sys.path.insert(0, os.path.dirname(os.path.realpath(
    os.path.abspath(__file__))) + '/youtube-dl')

import youtube_dl


class my_print:
    def __init__(self):
        self.buff = ''
        self.__console__ = sys.stdout

    def write(self, outstream):
        self.buff += outstream

    def flush(self):
        ''

    def get_data(self):
        return self.buff

    def reset(self):
        sys.stdout = self.__console__


def get_play_url(id):
    r_obj = my_print()
    sys.stdout = r_obj
    youtube_dl.main([u'-j', id])
    r_obj.reset()
    return r_obj.get_data()


if __name__ == '__main__':
    # print get_play_url(u'http://www.ted.com/talks/r_luke_dubois_insightful_human_portraits_made_from_data')
    youtube_dl.main([sys.argv[1], '-j', '--no-check-certificate', '--youtube-skip-dash-manifest'])
